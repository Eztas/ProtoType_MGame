// 2021-08-01


jQuery(function() {
  let baseurl = "https://lets-csharp.com/analyze/";
  let phpurl = baseurl + "analyze-game.php";

  let timeout = 1000 * 30; // millisecond.

  let width1 = jQuery(window).width();
  let flug = true;
  let scroll1 = 0;

  let url1 = location.href;

  let dat1 = "none";
  if(document.getElementById( 'DAT' ) != null)
      dat1 = document.getElementById( 'DAT' ).title;

  var prev_page1 = document.referrer;

  jQuery.get(phpurl, {
      scroll0:0,
      width0:width1,
      curpage:url1,
      prev_page:prev_page1,
      next_page:"",
      action0:"In",
      dat0:dat1,
  });

  jQuery('a').click (function (){
      val = jQuery(this).attr("href");
      var next_page1 = val;

      jQuery.get(phpurl,{
          scroll0:scroll1,
          width0:width1,
          curpage:url1,
          prev_page:"",
          next_page:next_page1,
          action0:"Click!!",
          dat0:"",
      });
  });

  jQuery(window).scroll(function() {
      if(flug){
          flug = false;
          setTimeout(function(){
              val = jQuery(this).scrollTop();
              scroll1 = val;

              jQuery.get(phpurl,{
                  scroll0:scroll1,
                  width0:width1,
                  curpage:url1,
                  prev_page:"",
                  next_page:"",
                  action0:"Scroll",
                  dat0:"",
              });
              flug = true;
          }, timeout);
      }
  });
}); // $(fu nction() End

