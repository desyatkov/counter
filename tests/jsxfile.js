const game = {
  leftTeam: "Marsel",
  leftFlag: '//d15o9qq6jqrrp9.cloudfront.net/ps-assets/templates/worldcup-flag/england.png',
  rightTeam: "Thailand",
  rightFlag: "//d15o9qq6jqrrp9.cloudfront.net/ps-assets/templates/worldcup-flag/tunisia.png" ,
  day: '07',
  hrs: '23',
  mins: '11',
};

function h(type, props, ...children) {
  return { type, props, children };
}

function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  const $el = document.createElement(node.type);

  for (let key in node.props) {
    if (node.props.hasOwnProperty(key)) {
      $el.setAttribute(key, node.props[key])
    }
  }

  node.children
    .map(createElement)
    .forEach($el.appendChild.bind($el));
  return $el;
}

function createNode(param){
  var component = h(
    "li", { "class": "count--box" },
    h( "div", { "class": "flag" },
      h( "div", { "class": "flag-l" },
        h("img", { src: param.leftFlag, alt: "england" }),
        h( "div", { "class": "label", id: "label-l" }, param.leftTeam )
      ),
      h( "div", { "class": "vs" }, "vs" ),
      h( "div", { "class": "flag-r" },
        h("img", { src: param.rightFlag, alt: "tunisia" }),
        h( "div", { "class": "label", id: "label-r" }, param.rightTeam)
      )
    ),
    h( "div",  { "class": "countdown", id: "countdown" },
      h( "div",  { "class": "timer number" },
        h( "div",  { "class": "day" },  "07" ),
        h( "div",  { "class": "delimiter" },  ":" ),
        h( "div",  { "class": "hrs" },  "23" ),
        h( "div",  { "class": "delimiter" },  ":" ),
        h( "div",  { "class": "mins" },  "11" )
      ),
      h( "div",  { "class": "timer label" },
        h("div", { "class": "day" }, "Days"),
        h("div", { "class": "delimiter" }),
        h("div", { "class": "hrs" }, "Hrs"),
        h("div", { "class": "delimiter" }),
        h("div", { "class": "mins" }, "Mins")
      )
    )
  );

  return component
}

const $root = document.getElementById('root');
$root.appendChild(createElement(createNode(game)));
