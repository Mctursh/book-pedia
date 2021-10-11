let prev, isPresent = false, isFound = false;


const _fetch = (str) => {
    if (prev !== str) {
        fetch(`/books/api/${str}`)
        .then((res) => {
            return res.json()
        })
        .then(({data}) => {
            if (data.length == 0) {
                isFound = false // No result found
            } else if (data.length > 0) {
                updateSuggestions(data) //updating the suggestion modal
            }
        })
    }
    prev = str;
}

const handleFocus = (id) => {;
    if (document.activeElement === document.querySelector(id)) {
        const interval = setInterval(function () {
            let inp = $(id).val();    
            document.querySelector("#search-book").action = `/books?name=${inp}`  //setting the post url 
            if (inp.length > 0) {
                $(".suggestions").removeClass("hide")
                isPresent ? $(".loader_parent, #no_result").addClass("hide") : ($(".loader_parent, lds-roller").removeClass("hide"), $("#no_result").addClass("hide"))
                !isFound && isPresent && noResult()
                _fetch(inp)
            } else {
                $(".suggestions").addClass("hide")
            }

            if (document.activeElement !== document.querySelector(id)) {
                clearInterval(interval) //ends the interval once the input looses focus
            }
        }, 100)    
    } 
}

function updateSuggestions(params) {
    isPresent = true
    isFound = true
    $("#no_result").addClass("hide")
    $(".loader_parent").addClass("hide")
    $(".suggested_courses").removeClass("hide")
    const sug = $("#sug")[0]
    const format = (id) => {
        return `<li>
                    <a href='${id._id}'>
                        <p>${id.nativeName}</p>
                    </a>
                </li>`
    }
    let suggestionList = '';
    params.map(item => suggestionList += format(item))
    sug.innerHTML = suggestionList
}

function noResult() {
    $("#no_result, .loader_parent").removeClass("hide")
    $(".suggested_courses, .lds-roller").addClass("hide")
}


function updateCount(params) {
    fetch('/download/count', {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({book : params})
    })
    .then(res => res.json())
    .then(res => {
        console.log(`${res.data} successfully posted`);
        // $("#test").attr("href", `https://google.com`)
    })
}