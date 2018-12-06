/* globals fetch */

/* Get var value from URL */
function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
} 

function goToUpdatePage(num) {
  var updatePageURL = "/update?_id=";
  updatePageURL += num;
  window.location.href = updatePageURL;
}

function getValFromURL(num) {
  document.getElementById('idVal').value = getJsonFromUrl()._id;
}

function localizeAllFormValues() {
	var id = document.getElementById('idVal').value;
	var title = document.getElementById('titleVal').value;
	var name = document.getElementById('nameVal').value;
	var description = document.getElementById('descVal').value;
	/*
	alert ( id );
	alert ( title );
	alert ( name );
	alert ( description );
	*/
	Update(id, title, name, description);
}

function Update (id, title, name, description) {
  fetch('update', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'id': id,
      'title': title,
	  'name': name,
	  'description': description
	})
  }).then(function (response) {
	// This function never gets executed??
  });
  /*
  .then(res => {
	if (res.ok) console.log("Reloading server...");
  })
  /*
  .then(data => {
	console.log(data)
  })
  */
 // alert("hi");
  console.log("Reloading server...");
  // location.href = ("/");
  var url = "http://www.google.com/";
  window.location = url;


  // window.location.href = "/homepage";
  // location.href = ("/home");
}
