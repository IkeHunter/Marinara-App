$(document).ready(function(){
	console.log('JavaScript Connected');

var itmDone = false;

$('#todoForm').on('submit', function(){

      var item = $('form input');
      var todo = {item: item.val()};

      $.ajax({
        type: 'POST',
        url: '/todo',
        data: todo,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }

      });
    });



$('.task').on('click', function(){

      var id = $(this).attr('id');
			console.log('you clicked '+id)
      $.ajax({
        type: 'DELETE',
        url: '/delete-task/' + id,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });

    });

		$('.todoItm').on('click', function(){

		      var id = $(this).attr('id');
					console.log('you clicked '+id)
		      $.ajax({
		        type: 'DELETE',
		        url: '/todo/' + id,
		        success: function(data){
		          //do something with the data via front-end framework
		          location.reload();
		        }
		      });

		    });

$('.item').on('click', function(){

      //var item = $(this).text().replace(/ /g, "-");
			var id = $(this).attr('id');
			console.log('you clicked ' + id );
      $.ajax({
        type: 'DELETE',
        url: '/delete-item/' + id,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });

    });

// $('.eachItem').on('click', function(){
//
//       var id = $(this).attr('id');
//
//       $.ajax({
//         type: 'POST',
//         url: '/item-done/:id',
//         //data: todo,
//         success: function(data){
//           //do something with the data via front-end framework
//           location.reload();
//         }
//
//       });
//     });














});



















//bottom
