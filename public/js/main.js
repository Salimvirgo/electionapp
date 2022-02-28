$(function () {
  $("#alertModal").hide();
  $("#frmNewElection").on("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const title = $("#electionTitle").val();
    const startDate = $("#electionStartDate").val();
    const endDate = $("#electionEndDate").val();

    const today = new Date().toLocaleDateString();

    if (title === "") {
      alert("Please enter election title");
      return;
    }

    if (new Date(startDate).toLocaleString() < today) {
      alert("Start date must be after today's date or exactly today's date");
      return;
    }

    if (
      new Date(endDate).toLocaleDateString() <
      new Date(startDate).toLocaleDateString()
    ) {
      alert("End date must be equal to or greater than start date");
      return;
    }

    const electionData = {
      title: title,
      startDate: startDate,
      endDate: endDate,
      statusID: 1,
    };
    $.ajax({
      url: "/admin/new_election",
      type: "POST",
      // dataType: "json",
      // contentType: "application/json; charset=utf-8",
      data: electionData,
      success: function (data, textStatus, xhr) {
        // window.location.href = data.redirectUrl;
        $("#alertModal").show();
        $("#alertSuccess").innerHTML = data.success_msg;
        $("#electionTitle").val() = "";
        $("#electionStartDate").val() = "";
        $("#electionEndDate").val() = "";
      },
      failure: function (error) {
        alert(error);
      },
    });
  }); //end of form submit

  $("#ballotQuestion").on("keyup", (e) => {
    if (e.target.value === "") {
      document.getElementById("ballotquestion_error").innerText =
        "Ballot Question is required";
      document.getElementById("submit_button").disabled = true;
    } else {
      document.getElementById("ballotquestion_error").innerText = "";
      document.getElementById("submit_button").disabled = false;
    }
  });
  // $("#electionId").select((e) => {
  //   if (e.target.value === "") {
  //     document.getElementById("submit_button").disabled = true;
  //     document.getElementById("ballotelection_error").innerText =
  //       "Select Ballot Election";
  //   } else {
  //     document.getElementById("submit_button").disabled = false;
  //     document.getElementById("ballotelection_error").innerText = "";
  //   }
  // });

  $("#frmBallot").on("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const ballotQuestion = e.target.ballotQuestion.value;
    const electionId = e.target.electionId.value;
    const description = e.target.ballotDesc.value;

    if (ballotQuestion === "") {
      document.getElementById("ballotquestion_error").innerText =
        "Ballot Question is required";
      return;
    }

    if (electionId === "") {
      document.getElementById("ballotelection_error").innerText =
        "Select Ballot Election";
      return;
    }
    const ballot = {
      question: ballotQuestion,
      electionId: electionId,
      description: description,
    };
    $.ajax({
      url: "/admin/add_ballot",
      method: "POST",
      dataType: "json",
      data: ballot,
      success: function (data) {
        console.log(data);
        window.location.reload();
      },
      failure: function (err) {
        console.log(err);
      },
    });
  });

  const voteBtn = document.querySelectorAll("#btnVote");
  voteBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const candidateId = e.target.getAttribute("data-candidate");
      $.ajax({
        method: "POST",
        url: "/vote",
        data: { candidateId },
        success: function (data) {
          if (data.err_msg) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: data.err_msg,
              footer: "",
            });
          } else if (data.success) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: data.success,
              showConfirmButton: false,
              timer: 5000,
            }).then(() => {
              window.location.href = data.redirectUrl;
            });
          }
        },
        failure: function (err) {
          console.log(err);
        },
      });
    });
  });
});
