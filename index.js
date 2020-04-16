//script published at https://fullstack-application-michael-zhao.michael-zhao.workers.dev

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function getData() {
  let response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
  let data = await response.json()
  return data.variants;
}

var Cookie = 'yummy_cookie'

/**
 * Respond with a variant page
 * @param {Request} request
 */
async function handleRequest(request) {
  const cookie = getCookie(request, Cookie)
  // console.log("cookie: " + cookie)
  const dataset = await getData()
  let resp;

  if (cookie) {
    let url = dataset[cookie]
    // console.log(url)
    resp = await fetch(url)
  }

  else {
    var randnum = Math.random() < 0.5 ? 0 : 1
    let url = dataset[randnum]
    let pg = await fetch(url)
    resp = new Response(pg.body)
    resp.headers.append('Set-Cookie', `yummy_cookie=${randnum}`)
  }
  
  return rewrite.transform(resp)
}

// Use the HTMLRewriter API in the bottom class and variable
class VariantHandler {
  element(element) {
    if (element.tagName == 'title') {
      element.setInnerContent("Michael's project for Cloudflare")
    }
    else if (element.tagName == 'h1') {
      element.setInnerContent("Michael Zhao")
    }
    else if (element.tagName == 'p') {
      element.setInnerContent("This is my project for the Cloudflare full-stack application!")
    }
    else if (element.tagName == 'a') {
      element.setAttribute('href', 'https://michael-zhao.github.io')
      element.setInnerContent("Michael's personal website")
    }
  }
}

//apply rewrite.transform() in the main event handler
var rewrite = new HTMLRewriter()
  .on('title', new VariantHandler())
  .on('h1#title', new VariantHandler())
  .on('p#description', new VariantHandler())
  .on('a#url', new VariantHandler())

//use cookies to remember--if/else used in the main event handler
function getCookie(request, name) {
  let res;
  let cookie = request.headers.get('Cookie')
  let cookieArr = cookie.split(';')
  for (var i = 0; i < cookieArr.length; i++) {
    var c = cookieArr[i].trim().split('=')
    if (c[0] == name) {
      res = c[1]
    }
  }
  return res;
}