addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const DEBUG = false;

const links = [{ "name": "Personal_Site", "url": "https://elibailey.org/" },
              { "name": "LinkedIn", "url": "https://www.linkedin.com/in/elijahbailey/" },
              { "name": "Github", "url": "https://github.com/eli1797" }];

url = 'https://static-links-page.signalnerve.workers.dev';

/**
 * Respond to the request with:
 *  1: JSON link objects
 *  2: HTML
 * @param {Request} request
 */
async function handleRequest(request) {
    try {
        const parts = request.url.split('/');

        if (parts.length == 4 && parts[3].includes('links')) {
            // return JSON link array
            return new Response(JSON.stringify(links), 
                {headers: {'content-type': 'application/json', 'status': 200}});
        } else {

            // fetch html text
            const response = await fetch(url, 
                {headers: {'content-type': 'text/html;charset=UTF-8'}} );

            // modify and transform the html response
            return new HTMLRewriter()
                .on('div#links', new LinksTransformer(links))
                .on('div#profile', new ProfileTransformer())
                .on('img#avatar', new AvatarTransformer())
                .on('h1#name', new UsernameTransformer())
                .on('div#social', new SocialTransformer())
                .transform(response);
        }

    } catch (e) {

        if (DEBUG) {
            return new Response(e.message || e.toString(), { status: 404, });
        } else { 
            return new Response(`"${defaultKeyModifier(url.pathname)}" not found`, 
                { status: 404, });
        }
    }
}


// Element Transformers

class LinksTransformer {
    constructor(links) {
        this.links = links
    }
    
    async element(element) {
        if (DEBUG) {
            console.log(`Incoming element: ${element.tagName}`); 
        }

        // build and append links
        for (let link of this.links) {
           element.append(`<a href="${link.url}">${link.name}</a>`, {html: true});
        }
    }
}

class ProfileTransformer {
    async element(element) {
        if (DEBUG) {
            console.log(`Incoming element: ${element.tagName}`); 
        }

        // remove "display: none" to show the profile
        element.setAttribute("style", "");
    }
}

class AvatarTransformer {
    async element(element) {
        if (DEBUG) {
            console.log(`Incoming element: ${element.tagName}`); 
        }

        // set the src to a profile image
        element.setAttribute("src", "https://avatars3.githubusercontent.com/u/29154483?s=460&u=94768030f59e4889fda99ae98e8d1a87d3df0b9e&v=4");
    }
}

class UsernameTransformer {
    async element(element) {
        if (DEBUG) {
            console.log(`Incoming element: ${element.tagName}`); 
        }

        // set a username
        element.setInnerContent("Eli Bailey");
    }
}

class SocialTransformer {
    async element(element) {
        if (DEBUG) {
            console.log(`Incoming element: ${element.tagName}`); 
        }

        // remove "display: none" to show the socials
        element.setAttribute("style", "");

        // append a social link
        const social = "https://twitter.com/"
        const svg = '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitter icon</title><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/></svg>';
        element.append(`<a href="${social}">${svg}</a>`, {html: true});
    }
}