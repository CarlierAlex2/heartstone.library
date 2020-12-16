const API_HEARTSTONE = "https://omgvamp-hearthstone-v1.p.rapidapi.com";
const KEY_RAPIDAPI = "33cfbd2fd6mshd1b64af868129a8p1a7089jsn81904d09c905";
const HOST_RAPIDAPI = "omgvamp-hearthstone-v1.p.rapidapi.com";
const TEST_CARD_ID_ARR = { "card1" : "EX1_591", "card2" : "EX1_050"}

let html_Sidebar, html_SidebarHideBtn;
let html_CardImage;
let html_SearchForm, html_SearchInput, html_SearchList, html_SearchButton, html_SearchLoading;
let html_CardName, html_CardSet, html_CardText, html_CardLoading;
let html_Cost, html_Attack, html_Health;
let currentCard;
let listCards;
let html_FilterList;
let defaultImage;

const MAX_HEALTH_HERO = 40;
const MAX_HEALTH_MINION = 20;
let MAX_HEALTH = MAX_HEALTH_MINION;
const MAX_ATTACK = 20;
const MAX_COST = 25;


///============================================================================================================================================================
//#region ==== Callbacks - subfunctions //
const fillSearchList = function(list){
	html_SearchList.classList.add("c-search__list-open");

	let listFound = [];
	let listFoundNames = [];
	let listContentHtml = "";


	for (const card of list) {
		if(card.hasOwnProperty("img") && listFoundNames.includes(card["name"]) == false && checkFilterCard(card) == true)
		{
			console.log(card);
			listFound.push(card);
			listFoundNames.push(card["name"]);
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
	html_value = html_object.querySelector(".js-stat__value");
	html_value.innerHTML = statValue;

	let percentage = statValue / statMax * 100;
	let percentString = `${percentage}%`

	//console.log(`Set bar to ${percentage}`);
	html_bar = html_object.querySelector(".js-stats__bar");
	html_bar.style.setProperty('--c-stats__bar-percentage', percentString);
};


const showCard = function(card){
	currentCard = card;
	let health = 0;
	let cost = 0;
	let attack = 0;

	//console.log(`card["type"] = ${card["type"]}`);
	let max_health_typed = (card["type"].toLowerCase() == "hero") ? MAX_HEALTH_HERO : MAX_HEALTH_MINION;

	if(card.hasOwnProperty("img")){
		html_CardImage.src = card["img"];
	}
	else{
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


	setBarPercentage(html_Health, health, max_health_typed);
	setBarPercentage(html_Attack, attack, MAX_ATTACK);
	setBarPercentage(html_Cost, cost, MAX_COST);
	html_CardLoading.classList.remove("c-loading--show");
};

const consoleCard = function(card)
{
	console.log(`name - ${card["name"]}`);
	console.log(`cardSet - ${card["cardSet"]}`);
	console.log(`cardType - ${card["type"]}`);

	console.log(`faction - ${card["faction"]}`);
	console.log(`rarity - ${card["rarity"]}`);

	console.log(`cost - ${card["cost"]}`);
	console.log(`attack - ${card["attack"]}`);
	console.log(`health - ${card["health"]}`);

	console.log(`text - ${card["text"]}`);
	console.log(`flavor - ${card["flavor"]}`);
	console.log(`artist - ${card["artist"]}`);
	console.log(`collectible - ${card["collectible"]}`);
	console.log(`playerClass - ${card["playerClass"]}`);

	console.log(`img - ${card["img"]}`);
	console.log(`imgGold - ${card["imgGold"]}`);
	console.log(`locale - ${card["locale"]}`);
};

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
//#endregion



///============================================================================================================================================================
//#region ==== Callbacks //
const callbackCardById = function(jsonObject){
	let card = jsonObject["0"];
	console.log(card);
	showCard(card);
};


const callbackCardByIdFail = function(jsonObject){
	console.log("Failed to load card");
	html_CardLoading.classList.remove("c-loading--show");
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
	html_SearchInput.setAttribute("isvalid", "false")
	fillSearchList(jsonObject);
	html_SearchList.classList.remove("c-search__list-hide");
	html_SearchLoading.classList.remove("c-icon-loading--show");
};


const callbackSearchFail = function(jsonObject){
	console.log("Could not find any cards matching the search input");
	html_SearchInput.setAttribute("isvalid", "true");
	html_SearchLoading.classList.remove("c-icon-loading--show");
};


const callBackLog = function(responseLog){
	console.log(responseLog);
};


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
//#endregion


///============================================================================================================================================================
//#region ==== Add event listeners - subfunctions //
const getInfo = function() {
	console.log("Get Info fetch");
	handleData(`${API_HEARTSTONE}/info`, callBackSetup, callBackLog, "GET");
};


const getDefaultCard = function(cardId) {
	handleData(`${API_HEARTSTONE}/cardbacks`, callBackDefaultImage, callBackLog, "GET");
};


const getCardyId = function(cardId) {
	console.log("Get CardById fetch");
	handleData(`${API_HEARTSTONE}/cards/${cardId}`, callbackCardById, callbackCardByIdFail, "GET");
};


const getCardList = function(){
	console.log("Get all cards fetch");
	handleData(`${API_HEARTSTONE}/cards`, callbackCardList, callBackLog, "GET");
};


const getCardSearchName = function(name){
	console.log("Get card by name fetch");
	handleData(`${API_HEARTSTONE}/cards/search/${name}`, callbackSearch, callbackSearchFail, "GET");
};


const beginSearch = function(){
	console.log("Search for....")
	html_SearchLoading.classList.add("c-icon-loading--show");
	const name = html_SearchInput.value;
	getCardSearchName(name);
};


const preventDefaultForm = function(list){
	html_SearchForm.addEventListener('submit', function(e) {
		e.preventDefault();
	}, false);
};


const eventShowCard = function(event){
	if(event.target && event.target.nodeName == "LI") 
	{
		if(!html_SearchList.classList.contains("c-search__list-open"))
		{
			return
		}

		html_CardLoading.classList.add("c-loading--show");
		const item = event.target;
		console.log(item + " was clicked");
		const cardId = item.getAttribute("data-cardId");
		const cardName = item.getAttribute("data-cardName");
		getCardyId(cardId);
		html_SearchList.classList.remove("c-search__list-open");
		html_SearchInput.value = cardName;
	}
}
//#endregion



//============================================================================================================================================================
//#region ==== Add event listeners //
const listenToSearch = function(){
	html_SearchButton.addEventListener("click", function() {
		beginSearch();
	  }); 

	html_SearchInput.addEventListener("keyup", function(event) {
		if (event.keyCode === 13) { 		// Number 13 is the "Enter" key on the keyboard
		  event.preventDefault();
		  beginSearch();
		}
	  }); 
};


const listenToHideSidebar = function(){
	html_SidebarHideBtn.addEventListener("click", function() {
		console.log("Hide Sidebar")
		html_Sidebar.classList.remove("c-app__sidebar--show");
	  }); 
};


const listenToShowSidebar = function(){
	html_SidebarShowBtn.addEventListener("click", function() {
		if(html_Sidebar.classList.contains("c-app__sidebar--show"))
		{
			console.log("Hide Sidebar")
			html_Sidebar.classList.remove("c-app__sidebar--show");
		}
		else
		{
			console.log("Hide Sidebar")
			html_Sidebar.classList.add("c-app__sidebar--show");
		}
	  }); 
};


const listenToSelectSearched = function(list){
	list.removeEventListener("click", eventShowCard); 
	list.addEventListener("click", eventShowCard); 
};
//#endregion



//============================================================================================================================================================
//#region ==== Fetch handler //
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
//#endregion



//============================================================================================================================================================
//#region ==== Get DOM elements //
const getDOMElements = function(){
	html_Sidebar = document.querySelector('.js-sidebar');
	html_SidebarHideBtn = document.querySelector('.js-sidebar-hide-button');
	html_SidebarShowBtn = document.querySelector('.js-sidebar-show-button');

	html_CardImage = document.querySelector('.js-card__image');
	html_CardLoading = document.querySelector('.js-card__loading');

	html_SearchForm = document.querySelector('.js-search');
	html_SearchInput = document.querySelector('.js-search__input');
	html_SearchList = document.querySelector('.js-search__list');
	html_SearchButton = document.querySelector('.js-search__btn');
	html_SearchLoading = document.querySelector('.js-search__loading');

	html_Health = document.querySelector('.js-health');
	html_Attack = document.querySelector('.js-attack');
	html_Cost = document.querySelector('.js-cost');

	html_FilterList = document.querySelector('.js-filter-list');
};
//#endregion



//============================================================================================================================================================
//#region ==== DOMContentLoaded //
document.addEventListener('DOMContentLoaded', function() {
	getDOMElements();
	preventDefaultForm();

	getInfo();
	getDefaultCard();
	getCardyId(TEST_CARD_ID_ARR["card1"]);

	listenToSearch();
	listenToHideSidebar();
	listenToShowSidebar();
});
//#endregion
