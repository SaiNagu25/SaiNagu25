// File Upload
// 
function ekUpload() {
var fileData=""
document.getElementById("search_input").addEventListener('change',(e)=>{
let sentances = fileData.split(".");
let search_text = e.target.value;
if(search_text){
let filtered = sentances.filter(e => e.toLowerCase().includes(search_text.toLowerCase())).map(e =>{
    return `<p>${e}</p>`
}).join("<br>")
    output(filtered)
    }else{
    output(fileData)
    }
})
  function Init() {

    console.log("Upload Initialised");

    var fileSelect = document.getElementById('file-upload'),
      fileDrag = document.getElementById('file-drag'),
      submitButton = document.getElementById('submit-button');

    fileSelect.addEventListener('change', fileSelectHandler, false);

    // Is XHR2 available?
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {
      // File Drop
      fileDrag.addEventListener('dragover', fileDragHover, false);
      fileDrag.addEventListener('dragleave', fileDragHover, false);
      fileDrag.addEventListener('drop', fileSelectHandler, false);
    }
  }

  function fileDragHover(e) {
    var fileDrag = document.getElementById('file-drag');

    e.stopPropagation();
    e.preventDefault();

    fileDrag.className = (e.type === 'dragover' ? 'hover' : 'modal-body file-upload');
  }

  function fileSelectHandler(e) {
    // Fetch FileList object
    var files = e.target.files || e.dataTransfer.files;

    // Cancel event and hover styling
    fileDragHover(e);

    // Process all File objects
    for (var i = 0, f; f = files[i]; i++) {
      parseFile(f);
      uploadFile(f);
    }
  }

  // Output
  function output(msg) {
    // Response
    var m = document.getElementById('messages');
    m.innerHTML = msg.replaceAll("\n", "<br>");
  }

  function parseFile(file) {

    console.log(file.name);
    output(
      '<strong>' + encodeURI(file.name) + '</strong>'
    );

    // var fileType = file.type;
    // console.log(fileType);
    var imageName = file.name;
    console.log(imageName)

    var isGood = (/\.(?=pdf|docx|xlsx)/gi).test(imageName);
    if (isGood) {
      document.getElementById('start').classList.add("hidden");
      document.getElementById("file-drag").classList.add("hidden");
      document.getElementById('response').classList.remove("hidden");

    }
    else {
      document.getElementById('file-image').classList.add("hidden");
      document.getElementById('start').classList.remove("hidden");
       document.getElementById("file-drag").classList.remove("hidden");
      document.getElementById('response').classList.add("hidden");
      document.getElementById("file-upload-form").reset();
    }
  }

  function setProgressMaxValue(e) {
    var pBar = document.getElementById('file-progress');

    if (e.lengthComputable) {
      pBar.max = e.total;
    }
  }

  function updateFileProgress(e) {
    var pBar = document.getElementById('file-progress');

    if (e.lengthComputable) {
      pBar.value = e.loaded;
    }
  }

  function uploadFile(file) {

    var xhr = new XMLHttpRequest(),
      fileInput = document.getElementById('class-roster-file'),
      pBar = document.getElementById('file-progress'),
      fileSizeLimit = 1024; // In MB
    if (xhr.upload) {
      // Check if file is less than x MB
      if (file.size <= fileSizeLimit * 1024 * 1024) {
        // Progress bar
        pBar.style.display = 'inline';
        xhr.upload.addEventListener('loadstart', setProgressMaxValue, false);
        xhr.upload.addEventListener('progress', updateFileProgress, false);

        // File received / failed
        xhr.onreadystatechange = function (e) {
          if (xhr.readyState == 4) {
            // Everything is good!
const msg = JSON.parse(xhr.responseText).message.replaceAll("\n","<br>")
fileData = msg;
            output(msg);
            // progress.className = (xhr.status == 200 ? "success" : "failure");
            // document.location.reload(true);
          }
        };

        // Start upload
        xhr.open('POST', 'http://localhost:8080/upload', true);
        xhr.withCredentials = false;
        var formData = new FormData();
        formData.append("file", file);
        xhr.send(formData);
      } else {
        output('Please upload a smaller file (< ' + fileSizeLimit + ' MB).');
      }
    }
  }

  // Check for the various File API support.
  if (window.File && window.FileList && window.FileReader) {
    Init();
  } else {
    document.getElementById('file-drag').style.display = 'none';
  }
}
ekUpload();