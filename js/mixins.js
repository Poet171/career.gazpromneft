"use strict";

var API_VERSION = "v1";
var mixins = {
	data: function data() {
		var _JSON$parse;
		return {
			URL_CAREER: "../../../../../default.htm",
			URL_CAREER_VACANCIES: "../../../../../vacancies/default.htm",
			URL_API_FILTER_LIST: "../../../../../api2/default.htm".concat(API_VERSION, "../../../../../filter/lists/default.htm"),
			URL_API_FILTER_CITIES: "../../../../../api2/default.htm".concat(API_VERSION, "../../../../../filter/cities/default.htm"),
			URL_API_VACANCIES_LIST: "../../../../../api2/default.htm".concat(API_VERSION, "../../../../../vacancies/list/default.htm"),
			URL_API_IDENTIFICATION_CITY: "../../../../../api2/default.htm".concat(API_VERSION, "../../../../../identification/city/default.htm"),
			URL_API_OFFICES: "../../../../../api2/default.htm".concat(API_VERSION, "../../../../../offices/list/default.htm"),
			URL_SAPID: "https://rc.successfactors.ru/visualrecruiter/candidate?culture=ru&id=",
			URL_CALLBACK_TO_FRIENDWORK: "../../../../../api2/default.htm".concat(API_VERSION, "../../../../../resume/add/default.htm"),
			loadStatus: false,
			// статус загрузки HTTP запроса
			favorites:
				(_JSON$parse = JSON.parse(
					localStorage.getItem("vacancies_favorites")
				)) !== null && _JSON$parse !== void 0
					? _JSON$parse
					: [] // IDшники вакансий добавленных в избранное
		};
	},
	methods: {
		httpRequest: function httpRequest(url, params, callback) {
			var _this = this;

			// стандартный запрос к серверу
			_this.loadStatus = true;
			axios
				.post(url, params)
				.then(function (res) {
					_this.loadStatus = false;
					return callback(res);
				})
				.catch(function (err) {
					_this.loadStatus = false;
					return callback(err);
				});
		},
		saveFilterRequest: function saveFilterRequest(req) {
			// сохранения настроек фильтра вакансий на клиенте
			localStorage.setItem("vacancies_filter", JSON.stringify(req));
		},
		getFilterRequest: function getFilterRequest() {
			// получение настроек фильтра вакансий на клиенте
			return JSON.parse(localStorage.getItem("vacancies_filter"));
		},
		switchAccardion: function switchAccardion(code, event) {
			var _this3 = this;

			var ref = _this3.$refs[code].style ? _this3.$refs[code] : _this3.$refs[code][0];
			ref.classList.toggle("show");
			if (event) {
				var that = event.toElement;
				if (that.classList.contains("filter-toggle")) {
					that.classList.toggle("collapsed");
				} else {
					var parent = that.closest(".filter-toggle");
					parent.classList.toggle("collapsed");
				}
				_this3.showAskLocation = false; // Скрываем tooltip askLocation
			}

		},
		initTooltip: function initTooltip() {
			jQuery('[data-toggle="tooltip"]').tooltip();
		},
		/* Работа с избранными */
		favoriteAddByID: function favoriteAddByID(id) {
			if (!this.favoriteIfExistsByID(id)) {
				this.favorites.push(id);
			}

			this.favoriteSaveList(this.favorites);
		},
		favoriteDeleteByID: function favoriteDeleteByID(id) {
			if (this.favoriteIfExistsByID(id)) {
				this.favorites.splice(
					this.favorites.findIndex(function (item) {
						return item === id;
					}),
					1
				);
			}

			this.favoriteSaveList(this.favorites);
		},
		favoriteSaveList: function favoriteSaveList(items) {
			localStorage.setItem("vacancies_favorites", JSON.stringify(items));
		},
		favoriteIfExistsByID: function favoriteIfExistsByID(id) {
			return (
				this.favorites.findIndex(function (item) {
					return item === id;
				}) !== -1
			);
		},
		/* Работа с городом */
		initLocation: function initLocationFilter() {
			var _that2      = this,
				location    = this.getLocation();

			if (location) {
				_that2.locationLoading = true;
				_that2.userSelectLocation = _that2.getParamLocalStorage('userSelectLocation');
			} else {
				this.httpRequest(this.URL_API_IDENTIFICATION_CITY, {}, function(res) {
					if (res && res.data && res.data.success) {
						_that2.saveLocation(res.data.data);
						_that2.locationLoading = res.data.data;
					} else {
						_that2.saveLocation(false);
						_that2.locationLoading = false;
					}
				});
			}
		},
		saveLocation: function saveLocation(obj) {
			localStorage.setItem("chosen_location", JSON.stringify(obj));
		},
		getLocation: function getLocation() {
			return JSON.parse(localStorage.getItem("chosen_location"));
		},
		clearLocation: function clearLocation() {
			localStorage.setItem("chosen_location", JSON.stringify(false));
			this.userSelectLocation = false;
		},
		getCity: function getCity() {
			var location = this.getLocation();

			if (location && location.title) {
				return location.title;
			}
			return false;
		},
		getCityId: function getCityId() {
			var location = this.getLocation();

			if (location && location.id) {
				return location.id;
			}
			return false;
		},
		saveParamLocalStorage: function saveParamLocalStorage(name, obj) {
			localStorage.setItem(name, JSON.stringify(obj));
		},
		getParamLocalStorage: function saveParamLocalStorage(name) {
			return JSON.parse(localStorage.getItem(name));
		},
		declOfNum: function declOfNum(n, titles) {
			// Склонение числительных, titles['офис', 'офиса', 'офисов']
			return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2]
		}
	}
};