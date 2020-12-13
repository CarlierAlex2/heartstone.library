const API_HEARTSTONE = "https://omgvamp-hearthstone-v1.p.rapidapi.com";
const KEY_RAPIDAPI = "33cfbd2fd6mshd1b64af868129a8p1a7089jsn81904d09c905";
const HOST_RAPIDAPI = "omgvamp-hearthstone-v1.p.rapidapi.com";
const TEST_CARD_ID_ARR = { "card1" : "EX1_591", "card2" : "EX1_050"}

let html_Sidebar, html_SidebarHideBtn;
let html_CardImage;
let html_SearchForm, html_SearchInput, html_SearchList, html_SearchButton;
let html_CardName, html_CardSet, html_CardText;
let html_Cost, html_Attack, html_Health;
let currentCard;
let listCards;
let html_FilterList;
let defaultImage;

const MAX_HEALTH_HERO = 30;
const MAX_HEALTH_MINION = 20;
let MAX_HEALTH = MAX_HEALTH_MINION;
const MAX_ATTACK = 20;
const MAX_COST = 25;



//============================================================================================================================================================
const callbackCardById = function(jsonObject){
	let card = jsonObject["0"];
	console.log(card);
	showCard(card);
};

const callBackDefaultImage = function(jsonObject){
	let card = jsonObject[0];
	defaultImage = card["img"];
};

const callbackCardList = function(jsonObject){
	console.log(jsonObject);

};

const callbackSearch = function(jsonObject){
	console.log(jsonObject);
	fillSearchList(jsonObject);
	html_SearchList.classList.remove("c-search__list-hide");
	//getCardyId(cardId);
};

const fillSearchList = function(list){
	html_SearchList.classList.add("c-search__list-open");

	let listFound = [];
	let listContentHtml = "";


	for (const card of list) {
		if(card.hasOwnProperty("img") && checkFilterCard(card) == true)
		{
			console.log(card);
			listFound.push(card);
		}
		if(listFound.length >= 5)
		{
			break;
		}
	}

	console.log(`Fill list - length: ${listFound.length}`);
	for (const card of listFound)
	{
		let cardId = card["cardId"];
		let cardName = card["name"];
		listContentHtml += `<li data-cardName="${cardName}" data-cardId="${cardId}">${cardName}</li>`;
	}

	html_SearchList.innerHTML = listContentHtml;
	listenToSelectSearched(html_SearchList);
};

const checkFilterCard = function(card){
	const listFilter = getFilterList();

	const playerClass = card["playerClass"];
	if(listFilter && playerClass)
	{
		if(listFilter.includes(playerClass))
		{
			return true;
		}
	}
	return false;
};

const getFilterList = function(){
	var listChecked = html_FilterList.querySelectorAll('input[type=checkbox]:checked');
	var checkBoxValues = [];
	// loop over them all
	for (var i=0; i<listChecked.length; i++) {
	   // And stick the checked ones onto an array...
	   if (listChecked[i].checked) {
		checkBoxValues.push(listChecked[i].value);
	   }
	}
	// Return the array if it is non-empty, or null
	return checkBoxValues.length > 0 ? checkBoxValues : null;
};

const setBarPercentage = function(html_object, statValue, statMax){
	html_fill = html_object.querySelector(".js-stats__fill");
	html_value = html_object.querySelector(".js-stat__value");
	
	html_fill.style.width = `${(statValue / statMax) * 100}%`;
	html_value.innerHTML = statValue;
};


const showCard = function(card){
	currentCard = card;
	let health = 0;
	let cost = 0;
	let attack = 0;

	if(card.hasOwnProperty("img")){
		html_CardImage.src = card["img"];
	}
	else
	{
		html_CardImage.src = defaultImage;
	}
	html_CardImage.alt = `Card image of ${card["name"]}`;

	if(card.hasOwnProperty("health")){
		health = card["health"];
	}
	if(card.hasOwnProperty("attack")){
		attack = card["attack"];
	}
	if(card.hasOwnProperty("cost")){
		cost = card["cost"];
	}

	/*
	html_CardName.innerHTML = card["name"];
	html_CardSet.innerHTML = card["cardSet"];
	html_CardText.innerHTML = card["text"];
	*/

	setBarPercentage(html_Health, health, MAX_HEALTH);
	setBarPercentage(html_Attack, attack, MAX_ATTACK);
	setBarPercentage(html_Cost, cost, MAX_COST);
};

const consoleCard = function(card)
{
	const name = card["name"];
	const cardSet = card["cardSet"];
	const cardType = card["type"];

	const faction = card["faction"];
	const rarity = card["rarity"];

	const cost = card["cost"];
	const attack = card["attack"];
	const health = card["health"];

	const text = card["text"];
	const flavor = card["flavor"];
	const artist = card["artist"];
	const collectible = card["collectible"];
	const playerClass = card["playerClass"];

	const img = card["img"];
	const imgGold = card["imgGold"];
	const locale = card["locale"];

	console.log(`name - ${name}`);
	console.log(`cardSet - ${cardSet}`);
	console.log(`cardType - ${cardType}`);

	console.log(`faction - ${faction}`);
	console.log(`rarity - ${rarity}`);

	console.log(`cost - ${cost}`);
	console.log(`attack - ${attack}`);
	console.log(`health - ${health}`);

	console.log(`text - ${text}`);
	console.log(`flavor - ${flavor}`);
	console.log(`artist - ${artist}`);
	console.log(`collectible - ${collectible}`);
	console.log(`playerClass - ${playerClass}`);

	console.log(`img - ${img}`);
	console.log(`imgGold - ${imgGold}`);
	console.log(`locale - ${locale}`);
};

const callBackLog = function(responseLog){
	console.log(responseLog);
};


//============================================================================================================================================================
const callBackSetup = function(jsonObject){
	console.log(jsonObject);
	listClasses = jsonObject["classes"];
	console.log(listClasses);

	let listToggles = "";
	let toCheck = [];
	for(const classObj of listClasses)
	{
		console.log(classObj);
		if(!toCheck.includes(classObj))
		{
			listToggles += createFilterItem("classes", classObj);
			toCheck.push(classObj);
		}
	}

	html_FilterList.innerHTML = listToggles;
}

const createFilterItem = function(checkBoxGroup, filterTag){
	html_obj = `
	<li class="c-toggle-list__item">
		<input class="o-hide-accessible c-option--hidden" type="checkbox" name="${checkBoxGroup}" id="${filterTag}" value="${filterTag}" checked>
		<label class="c-label c-custom-toggle" for="${filterTag}">
			${filterTag}
			<span class="c-custom-toggle__fake-input">
				<svg class="c-custom-toggle__symbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6.75">
					<path d="M4.75,9.5a1,1,0,0,1-.707-.293l-2.25-2.25A1,1,0,1,1,3.207,5.543L4.75,7.086,8.793,3.043a1,1,0,0,1,1.414,1.414l-4.75,4.75A1,1,0,0,1,4.75,9.5" transform="translate(-1.5 -2.75)"/>
				</svg>
			</span>
		</label>
	</li>
	`;

	return html_obj;
};



//============================================================================================================================================================
const handleData = function(url, callbackFunctionName, callbackErrorFunctionName = null, method = 'GET', body = null) {
	fetch(url, {
	  method: method,
	  body: body,
	  headers: {"x-rapidapi-key": `${KEY_RAPIDAPI}`, "x-rapidapi-host": `${HOST_RAPIDAPI}`, 'content-type': 'application/json'}
	})
	  .then(function(response) {
		if (!response.ok) {
		  console.warn(`>> Probleem bij de fetch(). Statuscode: ${response.status}`);
		  if (callbackErrorFunctionName) {
			console.warn(`>> Callback errorfunctie ${callbackErrorFunctionName.name}(response) wordt opgeroepen`);
			callbackErrorFunctionName(response); 
		  } else {
			console.warn('>> Er is geen callback errorfunctie meegegeven als parameter');
		  }
		} else {
		  console.info('>> Er is een response teruggekomen van de server');
		  return response.json();
		}
	  })
	  .then(function(jsonObject) {
		if (jsonObject) {
		  console.info('>> JSONobject is aangemaakt');
		  console.info(`>> Callbackfunctie ${callbackFunctionName.name}(response) wordt opgeroepen`);
		  callbackFunctionName(jsonObject);
		}
	  });
};


const getInfo = function() {
	console.log("Get Info fetch");
	handleData(`${API_HEARTSTONE}/info`, callBackSetup, callBackLog, "GET");
};

const getDefaultCard = function(cardId) {
	handleData(`${API_HEARTSTONE}/cardbacks`, callBackDefaultImage, callBackLog, "GET");
};

const getCardyId = function(cardId) {
	console.log("Get CardById fetch");
	handleData(`${API_HEARTSTONE}/cards/${cardId}`, callbackCardById, callBackLog, "GET");
};

const getCardList = function(){
	console.log("Get all cards fetch");
	handleData(`${API_HEARTSTONE}/cards`, callbackCardList, callBackLog, "GET");
};

const getCardSearchName = function(name){
	console.log("Get card by name fetch");
	handleData(`${API_HEARTSTONE}/cards/search/${name}`, callbackSearch, callBackLog, "GET");
};

const listenToSearch = function(){
	html_SearchButton.addEventListener("click", function() {
		console.log("Search for....")
		const name = html_SearchInput.value;
		getCardSearchName(name);
	  }); 

	  /*
	html_SearchInput.addEventListener("keyup", function(event) {
		// Number 13 is the "Enter" key on the keyboard
		if (event.keyCode === 13) {
		  event.preventDefault();
		  console.log("Search for....")
		  const name = html_SearchInput.value;
		  getCardSearchName(name);
		}
	  }); 
	  */
};

const listenToHideSidebar = function(){
	html_SidebarHideBtn.addEventListener("click", function() {
		console.log("Hide Sidebar")
		html_Sidebar.classList.remove("c-app__sidebar--show");
	  }); 
};

const listenToShowSidebar = function(){
	html_SidebarShowBtn.addEventListener("click", function() {
		console.log("Show Sidebar")
		html_Sidebar.classList.add("c-app__sidebar--show");
	  }); 
};

const listenToSelectSearched = function(list){
	list.removeEventListener("click", eventShowCard); 
	list.addEventListener("click", eventShowCard); 
};

const disableDefaultForm = function(list){
	$(document).on("keypress", 'form', function (e) {
		var code = e.keyCode || e.which;
		if (code == 13) {
			e.preventDefault();
			return false;
		}
	});
};

const eventShowCard = function(event){
	if(event.target && event.target.nodeName == "LI") 
	{
		if(!html_SearchList.classList.contains("c-search__list-open"))
		{
			return
		}

		const item = event.target;
		console.log(item + " was clicked");
		const cardId = item.getAttribute("data-cardId");
		const cardName = item.getAttribute("data-cardName");
		getCardyId(cardId);
		html_SearchList.classList.remove("c-search__list-open");
		html_SearchInput.value = cardName;
	}
}


//============================================================================================================================================================
const getHtmlElements = function(){
	html_Sidebar = document.querySelector('.js-sidebar');
	html_SidebarHideBtn = document.querySelector('.js-sidebar-hide-button');
	html_SidebarShowBtn = document.querySelector('.js-sidebar-show-button');

	html_CardImage = document.querySelector('.js-card__image');

	html_SearchForm = document.querySelector('.js-search');
	html_SearchInput = document.querySelector('.js-search__input');
	html_SearchList = document.querySelector('.js-search__list');
	html_SearchButton = document.querySelector('.js-search__btn');

	html_Health = document.querySelector('.js-health');
	html_Attack = document.querySelector('.js-attack');
	html_Cost = document.querySelector('.js-cost');

	html_FilterList = document.querySelector('.js-filter-list');

	/*
	html_CardName = document.querySelector('.js-card__name');
	html_CardSet = document.querySelector('.js-card__set');
	html_CardText = document.querySelector('.js-card__text');
	*/
};




document.addEventListener('DOMContentLoaded', function() {
	getHtmlElements();

	getInfo();
	getDefaultCard();
	//getCardSearchName("a");
	getCardyId(TEST_CARD_ID_ARR["card1"]);
	//getCardyId(TEST_CARD_ID_02);

	//disableDefaultForm();
	listenToSearch();
	listenToHideSidebar();
	listenToShowSidebar();
});

