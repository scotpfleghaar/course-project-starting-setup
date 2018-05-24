//Register Service Workers from sw.js in the parent file

var deferredPrompt;

//Are service workers present in current browser? 
if("serviceWorker" in navigator){
    //Register sw.js to the browser
    navigator.serviceWorker
        .register('/sw.js')
        .then(function(){
            console.log("Service Worker Registered");
        });
}

// Custom install banner criteria after googles criteria is satisfied
window.addEventListener('beforeinstallprompt', function(event){
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});