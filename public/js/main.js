let prev;
const _fetch = (str) => {
    if (prev !== str) {
        fetch(`/books/${str}`).then((res) => {
            console.log(res);
            return res.json()
        }).then(data => {
            console.log(data);
        })
    }
    prev = str;
}

const handleFocus = (id) => {;
    if (document.activeElement === document.querySelector(id)) {
        const interval = setInterval(function () {
            let inp = $(id).val();    
            document.querySelector("#search-book").action = `book/${inp}`  //setting the post url 
            if (inp.length > 0) {
                _fetch(inp)    
            }

            if (document.activeElement !== document.querySelector(id)) {
                clearInterval(interval)
            }
        }, 100)    
    } 
}
