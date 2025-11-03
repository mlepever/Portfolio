//Json Managment

let main;
let project;

let currentProject

let projectData;

loadAndDisplayMainPage();
history.scrollRestoration = 'manual';


window.onpopstate = function(event) {
    if (event.state && event.state.type !== undefined){
        if (event.state.type === 'project'){
            showProjectPage(event.state.num, true, event.state.scroll);
        }
        else if (event.state.type === 'main'){
            showMainPage('', true, event.state.scroll);
        }
    }
};

function showProjectPage(num, isPop = false, scrollTo = 0){
    const timeAnimation = 0.5;
    const scroll = window.scrollY;

    main.style.animation = 'swipeOutRight ' + timeAnimation.toString() + 's forwards';

    setTimeout(() => {
        currentProject = project.parentNode.children[num];

        main.style.display = 'none';
        currentProject.style.display = 'block';

        if (!isPop){
            pushState('project', scroll, projectData[num].link, num);
            window.scrollTo({top: 0, behavior: 'instant'});
        }
        else{
            window.scrollTo({top: scrollTo, behavior: 'instant'});
        }

        currentProject.style.animation = 'swipeInLeft ' + timeAnimation.toString() + 's forwards';

    }, timeAnimation * 1000);
}

function showMainPage(id, isPop = false, scrollHistory = 0){
    const timeAnimation = 0.5;
    const scroll = window.screenY;

    currentProject.style.animation = 'swipeOutLeft ' + timeAnimation.toString() + 's forwards';

    setTimeout(() => {
        currentProject.style.display = 'none';
        main.style.display = 'block';

        if (!isPop){
            pushState('main', scroll);
            window.scrollTo({top: id.offsetTop, behavior: 'instant'});
        }
        else{
            window.scrollTo({top: scrollHistory, behavior: 'instant'});
        }

        main.style.animation = 'swipeInRight ' + timeAnimation.toString() + 's forwards';
    }, timeAnimation * 1000);
}

function navigationButton(id){
    const idSection = document.getElementById(id);

    if (history.state.type === 'project'){
        showMainPage(idSection);
    }
    else{
        window.scrollTo({top: idSection.offsetTop, behavior: 'smooth'});
    }
}

function pushState(page, scroll, link = '', num = -1){
    addScrollToState(scroll);
    history.pushState({type: page, num: num}, '', `/${link}`)
}

function addScrollToState(scroll){
    history.replaceState({...history.state, scroll: scroll}, '', window.location.pathname)
}









async function loadAndDisplayMainPage(){
    projectData = await loadJson('jsons/projects.json');

    loadAndDisplaySection(projectData, 'projects-container', createProjectCard);
    loadAndDisplaySection(await loadJson('jsons/about.json'), 'about-container', createAboutCard);
    loadAndDisplaySection(projectData, 'project-container', createProjectPage)

    main = document.querySelector('main');
    project = document.getElementById('project');

    const path = window.location.pathname.replace(/^\/+|\/+$/g, '');

    if (path) {
        const index = projectData.findIndex(p => p.link === path);

        if (index !== -1){
            currentProject = project.parentNode.children[index];

            main.style.display = 'none';
            currentProject.style.display = 'block';

            history.pushState({type: 'project', num: index}, '', `/${projectData[index].link}`);
            return
        }
        
        else{
            main.innerHTML = `<section><h1>404</h1><p>No project named ${path.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) }<br>:(</p></section>`;
            return
        }
    }
    
    history.pushState({type: 'main'}, '', '/');
    return
}

function loadAndDisplaySection(data, containerName, createFunction) {
    try{
        let num = 0;
        const container = document.getElementById(containerName);

        data.forEach(item => {
            container.innerHTML += createFunction(item, num);
            num += 1;
        })
    } 
    catch (error) {
        console.error('Error loading data:', error);
    }
}

function createProjectPage(data){
    return `
        <div id="project">
            <h2>${data.title}</h2>

            <div class="project-resume card">
                <video src=${data.video} autoplay loop muted playsinline webkit-playsinline x5-playsinline></video>
                <span>
                    <div class="project-info-line">
                        <h3>Genre:</h3>
                        <p>${data.genre}</p>
                    </div>
                    <div class="project-info-line">
                        <h3>Platform:</h3>
                        <p>${data.platform}</p>
                    </div>
                    <div class="project-info-line">
                        <h3>Engine:</h3>
                        <p>${data.engine}</p>
                    </div>
                    <div class="project-info-line">
                        <h3>Duration:</h3>
                        <p>${data.duration}</p>
                    </div>
                    <div class="project-info-line">
                        <h3>Team:</h3>
                        <p>${data.team}</p>
                    </div>
                </span>
            </div>

            <div class="card" id="project-text">
                <h3>Context</h2>
                <p>${data.context}</p>
            </div>

            <div class="card" id="project-text">
                <h3>Ambition</h2>
                <p>${data.ambition}</p>
            </div>

            <div class="card" id="project-text">
                <h3>My work</h2>
                <p>${data.work}</p>
            </div>
        </div>
    `
}

function createProjectCard(project, num){
    return `
        <div class="card" onclick="showProjectPage(${num})" style="cursor:pointer;">
            <video src="${project.video}" muted loop playsinline webkit-playsinline x5-playsinline></video>
            <div class="project-content">
                <h3>${project.title}</h3>
                <h4>${project.genre}</h4>
                <p>${project.description}</p>
                <div class="tag-container">
                    ${createTags(project.software, "software")}
                    ${createTags(project.language, "language")}
                    ${createTags(project.skill, "skill")}
                </div>
            </div>
        </div>
    `;
}

function createAboutCard(about){
    return `
        <div class="card" id="about-card">
            <h3>${about.category}</h3>
            <div class="tag-container">
                ${createTags(about.software, "software")}
                ${createTags(about.language, "language")}
                ${createTags(about.skill, "skill")}
            </div>
        </div>
    `;
}

function createTags(value, id){
    if (!value) return '';

    else if (Array.isArray(value)){
        return value.map(tag => `<span class="tag" id="tag-${id}">${tag}</span>`).join('');
    }

    return `<span class="tag" id="tag-${id}">${value}</span>`;
}

async function loadJson(path){
    const respone = await fetch(path);
    if (!respone.ok) throw new Error(`HTTP error! status: ${respone.status}`);
    return await respone.json();
}


//Loading Screen

let progress = 0;
const progressBar = document.getElementById('progress');
const loadingScreen = document.getElementById('loading-screen');

function updateProgress(percentage) {
    progressBar.style.width = percentage + '%';
}

const progressInterval = setInterval(() => {
    if (progress < 90) {
        progress += Math.random() * 3;
        if (progress > 90) progress = 90;
        updateProgress(progress);
    }
}, 100);

window.addEventListener('load', () => {
    clearInterval(progressInterval);

    let finalProgress = progress;
    const finalInterval = setInterval(() => {
        finalProgress += 5;
        if (finalProgress >= 100) {
            finalProgress = 100;
            updateProgress(100);
            clearInterval(finalInterval);
            
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 200);
        } else {
            updateProgress(finalProgress);
        }
    }, 30);
});