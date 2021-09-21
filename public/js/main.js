// $(document).ready(function () {
//   $("#btn").on("click", function() {
//     var fileInput = $(':file');
//     var files = [];
//     $.each(fileInput[0].files, function(i, file) {
//         files.push(file);
//     });

//     var zip = new JSZip();
//     var fileReader = new FileReader();
//     fileReader.onload = function() {
//       blob = this.result;
//       zip.file(file.name, blob);
//     };
//     zip.generateAsync({type: "blob", compressionOptions: {level: 9}})
//       .then(function(content) {
//         saveAs(blob, "pdf")
//         $.ajax({
//             data: blob,
//             method: "post",
//             url: "/upload"
//           })
//       })
//     // function addFileToZip(n) {
//     //     if(n >= files.length) {
//     //         zippingComplete(zip.generateAsync({type:"blob", compression:"deflate", compressionOptions: {
//     //     level: 9
//     // }}));
//     //         return;
//     //     }
//     //     var file = files[n];
//     //     var arrayBuffer;
//     //     var fileReader = new FileReader();
//     //     fileReader.onload = function() {
//     //         arrayBuffer = this.result;
//     //         zip.file(file.name, arrayBuffer);
//     //         addFileToZip(n + 1);
//     //     };
//     //     fileReader.readAsArrayBuffer(file);
//     // }
//     // addFileToZip(0);

//     // function zippingComplete(zip) {
//     //     formData = new FormData();
//     //     formData.append('fileZip', zip);
//     //     formData.append("param1", "blah");
//     //     $.ajax({
//     //       data: formData,
//     //       method: "post",
//     //       url: "/upload"
//     //     })
//     // }
//   })
// })
