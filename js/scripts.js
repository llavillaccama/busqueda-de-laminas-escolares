jQuery(document).ready(function($) {

  $( '.main-menu-jc' ).load( "menu.html", function() {
   $('.icon-menu').click(function(event) {
    if ($('.main-menu').hasClass('active')) {
      $('.main-menu').removeClass('active');
    }else{
      $('.main-menu').addClass('active');
    }
  });
   openformsearch();
 });

  function openformsearch(){
    $('.share-icon-home').click(function(event) {
      var $this = $('#buscarlamina');
      if ($this.hasClass('active')) {
        $this.removeClass('active');
      }else{
        $this.addClass('active');
      }
    }); 
  }

});

jQuery(document).ready(function($) {

  function errorHandler(transaction, error) {
    console.log('Oops. Error was ' + error.message + ' (Code ' + error.code + ')');
    return true;
  }




  var db;
  var shortName='MyMobileApp';
  var version='0.1';
  var displayName='MyMobileApp';
  var maxSize = 65536;
  db = openDatabase(shortName,version,displayName,maxSize);


  db.transaction(
    function(transaction) {
      transaction.executeSql('DROP TABLE lamina',null,function(){console.log('Drop Succeeded');},function(){console.log('Drop Failed');});
      transaction.executeSql('DROP TABLE categoria',null,function(){console.log('Drop Succeeded');},function(){console.log('Drop Failed');});
      transaction.executeSql(
        'CREATE TABLE IF NOT EXISTS lamina ' +
        ' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
        ' numero INTEGER NULL, nombre TEXT NULL,descripcion TEXT NULL,categoria INTEGER NULL,editorial INTEGER NULL,imagen TEXT NULL);'
        );
      transaction.executeSql(
        'CREATE TABLE IF NOT EXISTS categoria ' +
        ' (id INTEGER NOT NULL PRIMARY KEY, ' +
        ' nombre TEXT NULL);'
        );
    }
    ); 
  $.getJSON("categoria.json", listarcategorias);
  function listarcategorias(data)
  {
   db.transaction(
    function(transaction) {
      $.each(data, function(index, val) {
        var id = val['id'];
        var nombre = val['nombre'];
        transaction.executeSql(
          'INSERT INTO categoria (id,nombre) VALUES (?,?);',
          [id,nombre],
          null,
          errorHandler
          );
      });
    }
    );
   llenarcategorias();
 }
 $.getJSON("lamina.json", llenarlaminas);
 function llenarlaminas(data)
 {
   db.transaction(
    function(transaction) {
     $.each(data, function(index, val) {
      var numero = val['numero'];
      var nombre = val['nombre'];
      var descripcion = val['descripcion'];
      var categoria = val['categoria'];
      var editorial = val['editorial'];
      var imagen = val['imagen'];
      transaction.executeSql(
        'INSERT INTO lamina (numero, nombre, descripcion, categoria, editorial, imagen) VALUES (?,?,?,?,?,?);',
        [numero,nombre,descripcion,categoria,editorial,imagen],
        null,
        errorHandler
        );
    });
   }
   );
   categoriaschange();
   detallelamina();
 }

 function llenarcategorias(){
  db.transaction(
    function(transaction) {
      transaction.executeSql(
        'SELECT * FROM categoria;',
        [],
        function (transaction, result) {
          for (var i=0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            $('.lamina-categoria select').append(' <option id="'+row.id+'">'+ row.nombre +'</option>');
          }
        },
        errorHandler
        );
    }
    );
}

function categoriaschange(){
  db.transaction(
    function(transaction) {
      var id = $('.lamina-categoria select').children(":selected").attr("id");
      $('.resultado').html("");
      transaction.executeSql(
        'SELECT * FROM lamina WHERE categoria ='+ id +';',
        [],
        function (transaction, result) {
          for (var i=0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            $('.lamina-categoria .resultado').append('<div class="col-sm-6 col-md-4"> <a href="detalle.html?id='+row.id+'"><div class="thumbnail"> <h3>'+ row.nombre +'</h3>  <img src="images/'+row.imagen +'" alt="'+ row.nombre+'"><div class = "numero">'+row.numero+'</div> </div></a> </div>');
          }
        },
        errorHandler
        );
    }
    );
}

$(".lamina-categoria select").change(function() {
 categoriaschange();
});

$('#buscarlamina').submit(function(event) {
  var name = $('.txt-name').val();
  $('.resultado').html("");
  db.transaction(
    function(transaction) {
      transaction.executeSql(
        'SELECT * FROM lamina WHERE nombre LIKE "%'+ name +'%";',
        [],
        function (transaction, result) {
          for (var i=0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            $('.resultado').append('<div class="col-sm-6 col-md-4"> <a href="detalle.html?id='+row.id+'"><div class="thumbnail"> <h3>'+ row.nombre +'</h3>  <img src="images/'+row.imagen +'" alt="'+ row.nombre+'"><div class = "numero">'+row.numero+'</div> </div></a> </div>')
          }
        },
        errorHandler
        );
    }
    );
  event.preventDefault();
});

function detallelamina(){

  $.urlParam = function(name){
   var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
   if (results) {
    return results[1] || 0;
  }
}
var id_lamina = $.urlParam('id');
db.transaction(
  function(transaction) {
    transaction.executeSql(
      'SELECT * FROM lamina WHERE id ='+id_lamina+';',
      [],
      function (transaction, result) {
        for (var i=0; i < result.rows.length; i++) {
          var row = result.rows.item(i);
          $('.lamina-detalle .resultado').append('<div class="lamina"><h3>'+ row.nombre +'</h3>  <img src="images/'+row.imagen +'" alt="'+ row.nombre+'"><div class = "numero">'+row.numero+'</div> </div>')
        }
      },
      errorHandler
      );
  }
  );
}

});

jQuery(document).ready(function($) {


//http://laminas.soporte.website/lamina.json

var fileTransfer = new FileTransfer();
var uri = encodeURI("http://laminas.soporte.website/lamina.json");

fileTransfer.download(
    uri,
    fileURL,
    function(entry) {
        console.log("download complete: " + entry.toURL());
        alert("complete");
    },
    function(error) {
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("upload error code" + error.code);
        alert("error");
    },
    false,
    {
        headers: {
            "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
        }
    }
);


});


