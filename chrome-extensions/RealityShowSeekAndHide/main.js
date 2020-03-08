const url = $(location).attr("href");
const genericStrings = [ "reality" ]
const bbbStrings = [ "bbb", "paredao", "siebert", "brother", "sister" ];
const aFazendaStrings = [ "fazenda", "peao", "peoa", "hariany", "roca" ];
const realityStrings = genericStrings.concat(bbbStrings).concat(aFazendaStrings);

logElementHidden = el =>{
  console.log(" ::: realityBlocker ::: element hidden: " + el);
}

logElementErr = el =>{
  console.log(" ::: realityBlocker ::: element ERROR: " + el);
}

seekRealityAndHide = (element=undefined, target=undefined, ...params) => {
  realityStrings.map(item=>{
    if (element.toLowerCase().indexOf(item)>=0) {
      target.hide();
      logElementHidden(element);
    }
  });
};

seekRealityAndHideNested = (element=undefined, target=undefined, nested=undefined, nestedCond=undefined) => {
  try {
    if (element != undefined && target != undefined && nested != undefined && nestedCond != undefined){
      realityStrings.map(item=>{
        if (element.toLowerCase().indexOf(item)>=0) {
          target.fadeOut("fast");
          logElementHidden(element);
          if (nestedCond === true){
            nested.fadeOut("fast");
            logElementHidden(nested);
          }
        }
      });
    }
  } catch {
    logElementErr(element + ' or '+ nested);
  }
};

// if URL string contains forbidden reality string:
seekRealityAndHide(element=url,
                  target=$(document.body))

$(window).bind("load", function() {
  $("span").each(function() {
    seekRealityAndHideNested(element=$(this).html(),
                            target=$(this),
                            nested= $(this).parent().next(),
                            nestedCond=true)
  });

  $("a").each(function() {
    seekRealityAndHideNested(element=$(this).html(),
                            target=$(this),
                            nested=$(this).parent().next(),
                            nestedCond=$(this).parent().next().attr('class') === 'chamada-relacionada')

    seekRealityAndHideNested(element=$(this).attr('href'),
                            target=$(this),
                            nested=$(this).parent().next(),
                            nestedCond=true)
  })

  $("h1").each(function() {
    seekRealityAndHideNested(element=$(this).html(),
                            target=$(this),
                            nested= $(this).parents("div[class~='video']"),
                            nestedCond=true)
  });

  $("h3").each(function() {
    seekRealityAndHideNested(element=$(this).html(),
                            target=$(this),
                            nested= $(this).parent().next(),
                            nestedCond=true)
  });

  $("p").each(function() {
  seekRealityAndHideNested(element=$(this).html(),
                            target=$(this),
                            nested=$(this).parent().next(),
                            nestedCond=true)
  });

  realityStrings.map(item=>{
    $("[id~='"+ item +"']").fadeOut("fast");
  });
});
