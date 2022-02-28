require("dotenv").config();
const express = require("express");
const path = require("path");
const flash = require("express-flash");
const passport = require("passport");
const multer = require("multer");
const session = require("express-session");
const bodyParser = require("body-parser");
const expressLayout = require("express-ejs-layouts");
const MysqlSessionStore = require("express-mysql-session")(session);
const { options, connection } = require("./database/db");
const { dbObject } = require("./database/db");
const readExcel = require("read-excel-file");
const xlsx = require("xlsx");
const fs = require("fs");
const app = express();

require("./auth/passport")(passport);

//mutler storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/candidatePhoto/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${new Date().toISOString().replace("/:/g", "-")}-${file.originalname}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|xlsx/;
  const allowedExtension = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const allowedMimetypes = filetypes.test(file.mimetype);
  if (allowedExtension && allowedMimetypes) {
    return cb(null, true);
  } else {
    cb(null, false);
  }
};

const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

const uploadExcel = multer({
  storage: excelStorage,
  fileFilter: excelFilter,
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "/public")));

const sessionStore = new MysqlSessionStore(options, connection);
app.use(
  session({
    secret: "session_cookie_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.use(expressLayout);
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.err_msg = req.flash("err_msg");
  res.locals.error = req.flash("error");
  next();
});

let electionDetail,
  election_title,
  election_start_date,
  election_end_date,
  election_status;

let voters,
  ballots,
  candidates = [];
const isAdmin = true;
app.use(async (re, res, next) => {
  electionDetail = await dbObject.GetTopElection();
  votes = await dbObject.GetAllVotes();
  voters = await dbObject.GetAllVoters();
  ballots = await dbObject.GetAllBallots();
  candidates = await dbObject.GetAllCandidates();
  election_title = electionDetail[0].title;
  election_start_date = electionDetail[0].start_date;
  election_end_date = electionDetail[0].end_date;
  election_status = electionDetail[0].status_name;

  next();
});

app.get("/", (req, res, next) => {
  res.render("index");
});
app.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/",
    failureFlash: true,
  }),
  async (req, res, next) => {
    const { voter_type } = req.user[0];
    if (voter_type === "admin") {
      return res.redirect("/admin/dashboard");
    } else {
      return res.redirect("/vote-page");
    }
    // const { voterKey, voterPass } = req.body;
    // const voterExist = await dbObject.GetVoterByKey(voterKey);
    // if (voterExist) {
    //   voter_pass = voterExist[0].voter_pass;
    //   if (voterPass === voter_pass) {
    //     voter_type = voterExist[0].voter_type;
    //     if (voter_type === "voter") {
    //       req.user = voterExist;
    //       console.log(req.user);
    //       res.redirect("/vote-page");
    //     } else {
    //       res.redirect("/admin/dashboard");
    //     }
    //   } else {
    //     req.flash("err_msg", "Invalid voter pass!!");
    //     console.log(res.locals);
    //     res.redirect("/");
    //   }
    // } else {
    //   req.flash("err_msg", "Invalid voter key. Try again");
    //   res.redirect("/");
    // }
  }
);

app
  .route("/admin")
  .get((req, res, next) => {
    res.render("admin/login");
  })
  .post((req, res, next) => {
    console.log(req.body);
  });

app.get("/admin/dashboard", (req, res, next) => {
  //console.log(voters.length, candidates.length, ballots.length);
  res.render("admin/admin-dashboard", {
    isAdmin,
    election_title,
    election_status,
    election_start_date,
    election_end_date,
    votes: votes.length,
    candidates: candidates.length,
    voters: voters.length,
    ballots: ballots.length,
  });
});

app.get("/admin/results", async (req, res) => {
  const allCandidates = await dbObject.GetAllCandidates();
  const allResults = await dbObject.GetAllResult();
  console.log(allResults);
  return;
  res.render("admin/results", { 
    isAdmin,
    allCandidates,
    allResults, 
    election_title,
    election_status 
  });
});
app.get("/admin/voters", async (req, res) => {
  const allDepartments = await dbObject.GetAllDepartments();
  const allLocations = await dbObject.GetAllLocations();
  const allVoters = await dbObject.GetAllVoters();
  res.render("admin/voters", {
    isAdmin,
    allDepartments,
    allLocations,
    allVoters,
    election_title,
    election_status,
  });
});

app.post(
  "/admin/upload/voters",
  uploadExcel.single("voters_file"),
  async (req, res, next) => {
    const filePath = path.join(__dirname, "/public/", req.file.filename);

    const depts = require("./depts");

    const book = xlsx.readFile(filePath);
    var sheet = book.Sheets["Sheet1"];
    const data = xlsx.utils.sheet_to_json(sheet);

    const new_data = data.map((d) => {
      // if (d.Location === "Freetown") {
      //   d.Location = 4;
      // } else if (d.Location === "Kenema") {
      //   d.Location = 5;
      // } else if (d.Location === "Wellington") {
      //   d.Location = 6;
      // } else if (d.Location === "Makeni") {
      //   d.Location = 7;
      // } else if (d.Location === "Kono") {
      //   d.Location = 8;
      // } else if (d.Location === "BO") {
      //   d.Location = 9;
      // }
      // d.fullname = d.NAMES;
      // d.sex = d.SEX;
      // d.department_name = d.DEPARTMENT;
      // d.department_id = 1;
      // d.location_id = d.Location;

      // delete d.__EMPTY;
      // delete d.NAMES;
      // delete d.DEPARTMENT;
      // delete d.SEX;
      // delete d.Location;

      // depts.forEach((dept) => {
      //   if (
      //     dept.department_name
      //       .toLowerCase()
      //       .includes(d.department_name.toLowerCase(), 0)
      //   ) {
      //     d.department_id = dept.department_id;
      //   }
      // });

      //delete d.department_name;

      return d;
    });

    console.log(new_data);

    // var newBook = xlsx.utils.book_new();
    // var newSheet = xlsx.utils.json_to_sheet(new_data);
    // xlsx.utils.book_append_sheet(newBook, newSheet);
    // xlsx.writeFile(newBook, "New Data.xlsx");
    // return;

    const imported = await dbObject.ImportVoters(new_data);
    if (imported) {
      req.flash("success", "Voters Successfully Imported");
      res.redirect("/admin/voters");
    } else {
      req.flash("err_msg", "Error Importing Voter's");
      res.redirect("/admin/voters");
    }
  }
);

app.post("/admin/voters", async (req, res) => {
  const { voters_name, voter_department, voter_sex, voter_location } = req.body;
  const savedUser = await dbObject.CreateNewVoter({
    voters_name,
    voter_department,
    voter_sex,
    voter_location,
  });
  if (savedUser) {
    req.flash("success", "Voter added successfully");
    res.redirect("/admin/voters");
  }
});

app.get("/admin/ballots", (req, res) => {
  res.render("admin/ballots", {
    isAdmin,
    election_title,
    election_status,
  });
});
app.get("/admin/add_ballot", async (req, res) => {
  const allElections = await dbObject.GetAllElections();
  const allBallots = await dbObject.GetAllBallots();
  const allCandidates = await dbObject.GetAllCandidates();
  const allDepartments = await dbObject.GetAllDepartments();
  console.log(allCandidates);
  res.render("admin/add-ballot", {
    allElections,
    allBallots,
    allDepartments,
    allCandidates,
    isAdmin,
    election_title,
    election_status,
  });
});

app.post("/admin/add_ballot", async (req, res) => {
  const { question, electionId, description } = req.body;
  const savedBallot = await dbObject
    .CreateNewBallot({
      question,
      electionId,
      description,
    })
    .catch((err) => {
      console.log(err);
    });

  if (savedBallot) {
    req.flash("success", "Successfully Added Ballot Question");
    res.status(200).send({ redirectUrl: "/admin/add_ballot" });
  }
});

app.post(
  "/admin/candidate",
  upload.single("candidatePhoto"),
  async (req, res, next) => {
    if (req.file) {
      const { candidateName, department_id } = req.body;
      const photo = req.file.filename;

      const savedCandidate = await dbObject
        .CreateNewCandidate({
          fullname: candidateName,
          ballot_id: department_id,
          photo: photo,
        })
        .catch((err) => {
          console.log(err);
        });
      if (savedCandidate) {
        req.flash("success", "Candidate Successfully Added ");
        res.redirect("/admin/add_ballot");
      } else {
        res.status(500).send({ error: "Internal Server Error" });
      }
    } else {
      res.send({ error: "Select Candidate Photo" });
      return;
    }
  }
);

app.get("/admin/new_election", async (req, res) => {
  const allElections = await dbObject.GetAllElections();

  res.render("admin/new-election", {
    elections: allElections,
    isAdmin,
    election_title,
    election_status,
  });
});
app.post("/admin/new_election", async (req, res, next) => {
  const { title, startDate, endDate, statusID } = req.body;
  const election = {
    title: title,
    start_date: startDate,
    end_date: endDate,
    status_id: statusID,
  };

  const saved = await dbObject.CreateNewElection(election).catch((err) => {
    console.error(err);
  });
  if (saved) {
    res.send({
      redirectUrl: "/admin/new_election",
      success_msg: "Successfully created election",
    });
  }
});

app.get("/admin/election/delete/:id", async (req, res, next) => {
  const { id } = req.params;
  const deleted = await dbObject.DeleteElectionByID(id).catch((err) => {
    console.log(err);
  });
  if (deleted) {
    req.flash("success", "Successfully deleted election");
    res.redirect("/admin/new_election");
  }
});
app.get("/admin/election/single/:id", (req, res, next) => {
  console.log(req.params.id);
});
app.post("/admin/election/update/:id", (req, res, next) => {
  console.log(req.params.id);
});

app.get("/admin/launch", (req, res) => {
  res.render("admin/launch", {
    isAdmin,
    election_title,
    election_status,
    election_start_date,
    election_end_date,
  });
});

app.get("/admin/setting", (req, res) => {
  res.render("admin/admin-settings", {
    isAdmin,
    election_title,
    election_status,
    election_start_date,
    election_end_date,
  });
});

app.get("/vote-page", async (req, res, next) => {
  const allCandidates = await dbObject.GetAllCandidates();
  res.render("user-vote", { allCandidates });
});

app.post("/vote", async (req, res, next) => {
  const { voters_id } = req.user;
  const { candidateId } = req.body;
  let vote = {
    voters_id,
    candidate_id: candidateId,
  };
  
  const hasVoted = await dbObject.HasVoted(voters_id).catch((err) => {
    res.send({ err });
  });

  console.log(hasVoted);

  if (hasVoted.length > 0) {
    res.send({ err_msg: "You have already voted, cannot vote twice" });
    return;
  } else {
    const savedVote = await dbObject.AddNewVote(vote).catch((err) => {
      console.log(err);
    });

    if (savedVote) {
      res.send({
        success: "You have successfully voted",
        redirectUrl: "/post-vote",
      });
      return;
    }
  }
});

app.get("/post-vote", (req, res, nxt) => {
  res.render("views/post-vote-page", {
    election_title,
    election_status,
  });
});

//Server Middleware
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
    if (err) {
        console.log("error: running this server");
    } else {
        console.log(`This application runs on http://localhost:${PORT}`);
    }
})

