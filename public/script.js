'use strict';

$(document).ready(function() {

  $("#get_pet_names").on("click", function() {
    getPetNames();
  });

  $("#add_pet").on("click", function() {
    addPetToDatabase();
  });

  $("#remove_pet").on("click", function() {
    console.log("remove pet");
    removePetFromDatabase();
  })
});

function getPetNames() {
  var $xhr = $.getJSON('http://localhost:8000/pets');
  $xhr.done(function(data) {
    if ($xhr.status !== 200) {
      console.error("somethng went wrong");
      return;
    }
    displayPetNames(data);
  });
  $xhr.fail(function(err) {
    console.log(err);
  });
}

function displayPetNames(petObjects) {

  var table = $("#pet_data");
  table.empty();
  var newHeader = "<tr><th>Name</th><th>Age</th><th>Kind</th></tr>";
  table.append(newHeader);

  for (var i = 0; i < petObjects.length; i++) {
    table.append(getPetDataRow(petObjects[i]));
    getPetPhoto(petObjects[i].kind);
  }
}

function getPetDataRow(petEntry) {
  var nameCell = "<td>" + petEntry.name + "</td>";
  var ageCell = "<td>" + petEntry.age + "</td>";
  var kindCell = "<td>" + petEntry.kind + "</td>";
  return "<tr class='pet_row'>" + nameCell + ageCell + kindCell + "</tr>";
}


function getPetPhoto(petKind) {
  console.log(petKind);
  var $xhr = $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=895b279df6ecc35b1e91b50a62dd8d4f&tags='+petKind+'&safe_search=true&has_geo=true&content_type=1&per_page=1&page=1&format=json&nojsoncallback=1');
  $xhr.done(function(data) {
    organizePhotoData(data.photos.photo);
  });
}

function organizePhotoData(photoIDs) {
  var photosList = [];
  for (var i = 0; i < photoIDs.length; i++) {
    photosList.push($.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=895b279df6ecc35b1e91b50a62dd8d4f&photo_id=' + photoIDs[i].id + '&format=json&nojsoncallback=1'));
  }
  Promise.all(photosList).then(function (data) {
    addPetPhotosToTable(data[0].sizes.size[1].source, index);
  });
}

var index = 0;
function addPetPhotosToTable(petPhoto) {
  var allPetRows = $(".pet_row");
  var photoHTML = "<td><img src='" + petPhoto + "' alt='photo'/></td>";
  // allPetRows[index].append(photoHTML);
  $(photoHTML).appendTo(allPetRows[index]);
  index++;
}


function addPetToDatabase() {
  var $petAge = $("#new_pet_age").val();
  var $petKind = $("#new_pet_kind").val();
  var $petName = $("#new_pet_name").val();

  $.ajax({
    type: "POST",
    url: 'http://localhost:8000/pets',
    contentType: "application/json",
    data: JSON.stringify({name: $petName, kind: $petKind, age: $petAge})
  });
}

function removePetFromDatabase() {
  var $petIndex = $("#pet_index").val();
  console.log($petIndex);
  $.ajax({
    type: "DELETE",
    url: 'http://localhost:8000/pets/' + $petIndex
  });
}
