/* globals fetch */

function deletePost(num) {
	fetch('home', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
	  'index': num
    })
  }).then(function (response) {
	// This function never gets executed??
  });
  // window.location.reload(true);
 // console.log("Reloading server...");
  // location.href = location.href;
  
 window.location.reload(true)
}