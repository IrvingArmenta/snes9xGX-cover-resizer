// main.js
import './styles/main.sass';
import $ from "cash-dom";

$(function () {

  var $uploadFileInput = $("#uploadFile");
  var $mainWrap = $("#mainForm");
  var $downloadLink = $('#imgDownload');
  var $urlInput = $('#urlInput');
  var $modal = $('#modal');
  var $submitURLButton = $('#submitUrlButton');

  function fetchDownload() {
    if ($urlInput.val() !== '') {
      const coverUrl = $urlInput.val();
      console.log(coverUrl);
      const getImg = fetch(coverUrl, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          "Content-Type": "image/jpeg"
        }
      }).then(res => {
        console.log(res);
      }).catch(e => {
        console.error(e);
      });
    } else {
      console.log('hey');
    }
  }

  $submitURLButton.on('click', fetchDownload);

  $modal.find('.modal-close').on('click', (e) => {
    $modal.removeClass('is-active');
    $uploadFileInput.val('');
  });

  
  function processFile(file) {
    var rotateCheck = $("#rotateCheck").prop("checked");
    $mainWrap.addClass("loading");

    var img = document.createElement("img");
    img.classList.add("sr-only-thumb-img");
    img.id = file.name;
    var reader = new FileReader();
    var canvas = document.createElement("canvas");
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      if (event.target) {
        if (event.target.result) {
          img.src = String(event.target.result);
          document.body.appendChild(img);
        }
      }
    };

    var ctx = canvas.getContext("2d");

    if (ctx) {
      setTimeout(() => {
        var currentImg = document.getElementById(file.name);
        if (rotateCheck) {
          canvas.height = 1534;
          canvas.width = 2100;
        } else {
          canvas.width = 1534;
          canvas.height = 2100;
        }

        if (rotateCheck) {
          ctx.save();
          ctx.rotate((-90 * Math.PI) / 180);
          ctx.drawImage(currentImg, -3366, 0, 3366, 2100);
          ctx.restore();
        } else {
          ctx.drawImage(currentImg, -1832, 0, 3366, 2100);
        }

        $("#mainImage").attr("src", canvas.toDataURL("image/png"));
        $downloadLink.attr('href', canvas.toDataURL("image/png"));
        $downloadLink.attr('download', file.name);
        
        $mainWrap.removeClass("loading").addClass("loaded");
        $modal.addClass('is-active');

        var parent = currentImg.parentNode;
        if (parent) {
          parent.removeChild(currentImg);
        }
      }, 150);
    }
  }

  $uploadFileInput.on("change", function () {
    if ($uploadFileInput.val() !== "") {
      var imgFile = $uploadFileInput.prop("files")[0];
      processFile(imgFile);
    }
  });
  
});