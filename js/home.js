"use strict";

new Vue({
	mixins: [ mixins ],
	// mixins.js переиспользование методов и свойств
	el: "#hot-vacancy",
	data: {
		vacancy: null,
		hotVacancies: [],
		// карточка вакансии
		isLoading: true
	},
	methods: {
		loadHotVacancy: function loadHotVacancy() {
			var _this = this;
			// рандомная вакансия
			this.isLoading = true;
			this.httpRequest(
				this.URL_API_VACANCIES_LIST,
				{
					only_hot: true,
					pagination: 1
				},
				function (res) {
					setTimeout(function () {
						if (res && res.data && res.data.success && res.data.data.length) {
							_this.hotVacancies = res.data.data.slice(0, 2);
							_this.isLoading = false;
						}
					}, 500);
				}
			);
		},
		loadHotTwoVacancy: function loadHotTwoVacancy() {
			var that = this;
			// меняем флаг загрузки hot vacancies
			this.isLoading = true;
			// загрузка списка горящих вакансий
			this.httpRequest(
				this.URL_API_VACANCIES_LIST,
				_objectSpread(
					_objectSpread({}, this.request),
					{},
					{
						only_hot: true,
						pagesize: 2
					}
				),
				function (res) {
					setTimeout(function () {
						if (res && res.data && res.data.success && res.data.data.length) {
							that.hotVacancies = res.data.data.slice(0, 2);
							// меняем флаг загрузки hot vacancies
							that.isLoading = false;
						}
					}, 500);
				}
			);
		}
	},
	mounted: function mounted() {
		this.loadHotVacancy();
	}
});
var Search = new Vue({
	mixins: [mixins],
	// mixins.js переиспользование методов и свойств
	el: "#search-form",
	data: {
		searchCity: "",
		// поисковая строка для списка городов
		searchInput: "",
		filter: {
			cities: []
		},
		request: {
			cities: [] // список городов
		}
	},
	methods: {
		loadFilter: function loadFilter() {
			var _this2 = this;

			// подгрузка данных фильтрации справа
			this.httpRequest(this.URL_API_FILTER_LIST, {}, function (res) {
				if (res && res.data && res.data.success && res.data.data) {
					_this2.filter = res.data.data;
				}
			});
		},
		sendSearchForm: function sendSearchForm() {
			window.location = ""
				.concat(this.URL_CAREER_VACANCIES, "?search=")
				.concat(this.searchInput, "&cities=")
				.concat(this.request.cities);
			console.log("sendSearchForm", window.location);
		}
	},
	computed: {
		filteredList: function filteredList() {
			var _this3 = this;

			// Метод берёд массив из filter.cities и фильтрует его на основании того что написано в input.searchCity
			return this.filter.cities.filter(function (city) {
				return city.title
					.toLowerCase()
					.includes(_this3.searchCity.toLowerCase());
			});
		},
		inputCity: function inputCity() {
			var self = this,
				count = 0,
				result = self.filter.cities.length
				? self.request.cities
					.map(function (cityId) {
						var oneCity = self.filter.cities.find( function (city) {
							return city.id === cityId;
						});

						if (oneCity) {
							count++;
							return oneCity.title;
						}
					})
					.join(", ")
				: "";
			return count > 2 ? 'Выбрано ' + count : result;
		},
		selectCityResult: function selectCityResult(count) {

			//если < 20

			// Выбран 1 город
			// если 1 городо

			if (count < 20) {
				// если остаток от деления === 0 тогда "городов"
				// если остаток от деления === 1 тогда "город"
				// если остаток от деления < 5 тогда "города"
			} else {

			}

			//иначе

			// если остаток от деления === 1 тогда "город"
			// если остаток от деления < 5 тогда "города"
			// если остаток от деления >= 5 или 0 тогда "городов"


			return "Выбрано " + count + ( (count % 10) <= 5   ? " города" : " городов")
		}
	},
	mounted: function mounted() {
		this.loadFilter();
	}
});
