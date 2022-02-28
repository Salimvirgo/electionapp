const mysql = require("mysql2");

const options = {
  host: "localhost",
  port: 3306,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
};

const connectionPool = mysql.createPool(options);

const connection = connectionPool.getConnection((err, connection) => {
  if (err) throw err;
  return connection;
});
connectionPool.on("connection", (connection) => {
  connection = connection;
  console.log("connected successfully");
});

const dbObject = {};
dbObject.CreateNewElection = (election) => {
  const { title, start_date, end_date, status_id } = election;
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO elections (title,start_date,end_date,status_id) values (?,?,?,?)";
    connectionPool.query(
      sql,
      [title, start_date, end_date, status_id],
      (err, result) => {
        if (err) return reject(err);

        return resolve(result);
      }
    );
  });
};
dbObject.GetAllElections = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "select election_id,title,start_date,end_date,status_name from elections inner join election_status on elections.status_id = election_status.status_id";
    connectionPool.query(sql, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.GetTopElection = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "select  election_id,title,start_date,end_date,status_name from elections inner join election_status on elections.status_id = election_status.status_id where status_name = 'Beginning' limit 1";
    connectionPool.query(sql, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.DeleteElectionByID = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE from elections where election_id = ?";
    connectionPool.query(sql, [id], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.CreateNewBallot = (ballot) => {
  const { question, electionId, description } = ballot;
  return new Promise((resolve, reject) => {
    const sql =
      "insert into ballots (title,election_id,description) values (?,?,?)";
    connectionPool.query(
      sql,
      [question, electionId, description],
      (err, result) => {
        if (err) return reject(err);

        return resolve(result);
      }
    );
  });
};
dbObject.CreateNewCandidate = (candidate) => {
  const { fullname, photo, ballot_id } = candidate;
  return new Promise((resolve, reject) => {
    const sql =
      "insert into candidates (fullname,photo,ballot_id) values (?,?,?);";
    connectionPool.query(sql, [fullname, photo, ballot_id], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.CreateNewVoter = (voter) => {
  const { voters_name, voter_sex, voter_department, voter_location } = voter;
  return new Promise((resolve, reject) => {
    const sql =
      "insert into voters (fullname,sex,department_id,location_id,vote_count) values (?,?,?,?,?);";
    connectionPool.query(
      sql,
      [voters_name, voter_sex, voter_department, voter_location, 1],
      (err, result) => {
        if (err) return reject(err);

        return resolve(result);
      }
    );
  });
};

dbObject.GetAllVoters = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "select voters_id, fullname, sex, department_name,location_name from voters inner join departments on voters.department_id = departments.department_id inner join locations on voters.location_id = locations.location_id";
    connectionPool.query(sql, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.GetVoterByKey = (key) => {
  return new Promise((resolve, reject) => {
    const sql =
      "select voters_id, fullname, sex,voter_key,voter_pass, department_name,location_name,vote_count,voter_type from voters inner join departments on voters.department_id = departments.department_id inner join locations on voters.location_id = locations.location_id where voter_key = ?";
    connectionPool.query(sql, [key], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.GetVoterByID = (id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "select voters_id, fullname, sex,voter_key,voter_pass, department_name,location_name,vote_count,voter_type from voters inner join departments on voters.department_id = departments.department_id inner join locations on voters.location_id = locations.location_id where voters_id = ?";
    connectionPool.query(sql, [id], (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.GetAllCandidates = () => {
  return new Promise((resolve, reject) => {
    const sql =
      "select c.candidate_id,c.fullname,c.photo,c.ballot_id, b.title from candidates as c inner join ballots as b on c.ballot_id = b.ballot_id";
    connectionPool.query(sql, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.GetAllVotes = () => {
  return new Promise((resolve, reject) => {
    const sql =
    "SELECT * FROM votes";
       //"select v.vote_id,v.voters_id,v.candidate_id,v.date_added, from votes as v inner join candidates as c on v.candidate_id = c.candidate_id inner join voters as v on v.voters_id = c.voters_id";
    connectionPool.query(sql, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.GetAllResult = () => {
  return new Promise((resolve, reject) => {
    const sql =
    "SELECT fullname, fullname from votes inner join voters on votes.voters_id = voters.voters_id inner join candidates on votes.candidate_id = candidates.candidate_id";
      
    connectionPool.query(sql, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.GetAllBallots = () => {
  return new Promise((resolve, reject) => {
    const sql = "select * from ballots";
    connectionPool.query(sql, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

// Departments
dbObject.GetAllDepartments = () => {
  return new Promise((resolve, reject) => {
    const sql = "select department_id, department_name from departments";
    connectionPool.query(sql, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.GetAllLocations = () => {
  return new Promise((resolve, reject) => {
    const sql = "select * from locations";
    connectionPool.query(sql, (err, result) => {
      if (err) return reject(err);

      return resolve(result);
    });
  });
};

dbObject.ImportVoters = (data) => {
  return new Promise((resolve, reject) => {
    const sql =
      "insert into voters (fullname,sex,voter_key,voter_pass,department_id,location_id,voter_type,vote_count) values (?,?,?,?,?,?,?,?);";
    data.forEach((voter) => {
      const {
        fullname,
        sex,
        voter_key,
        voter_pass,
        department_id,
        location_id,
        voter_type,
      } = voter;
      connectionPool.query(
        sql,
        [
          fullname,
          sex,
          voter_key,
          voter_pass,
          department_id,
          location_id,
          voter_type,
          1,
        ],
        (err, result) => {
          if (err) return reject(err);

          return resolve(result);
        }
      );
    });
  });
};

dbObject.AddNewVote = (vote) => {
  return new Promise((resolve, reject) => {
    const { voters_id, candidate_id } = vote;
    const sql = "insert into votes (voters_id,candidate_id) values (?,?)";

    connectionPool.query(sql, [voters_id, candidate_id], (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

dbObject.HasVoted = (voters_id) => {
  return new Promise((resolve, reject) => {
    const sql = "select * from votes where voters_id = ? LIMIT 1";

    connectionPool.query(sql, [voters_id], (err, results) => {
      if (err) return reject(err);

      return resolve(results);
    });
  });
};

module.exports = {
  options,
  connection,
  dbObject,
};
