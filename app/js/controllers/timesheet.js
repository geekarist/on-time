function Timesheet($scope, $http, $location) {
	$scope.DAYS = DAYS

	var CLIENT_ID = '847847973603-krmib75bv3djnfui1bdfp2beppo4ovaq.apps.googleusercontent.com'
	var API_KEY = 'AIzaSyCdGe4hL_v5Z4EET0mqcW-wEUPL6zow9Ko'
	// var CALENDAR_ID = '67sijt66lsm2knrachvdh5od4k@group.calendar.google.com'
	// var CALENDAR_ID = '67sijt66lsm2knrachvdh5od4k%40group.calendar.google.com'
	var SCOPE = 'https://www.googleapis.com/auth/calendar';
	var CALENDAR_ID = 'primary'
	var CALENDAR_EVENTS_LIST_URL =
		'https://www.googleapis.com/calendar/v3/calendars/' + CALENDAR_ID
		+ '/events'

	$scope.loginUrl = 
		'https://accounts.google.com/o/oauth2/auth' 
			+ '?response_type=token' 
			+ '&client_id=' + CLIENT_ID
			+ '&scope=' + SCOPE
			+ '&redirect_uri=' + 'http://localhost:8000'


	$scope.$watch('location.path()', function() {
		loadAccessTokenFromUrl()
		loadWeeksForCurrentMonth()
	}, true)

	function loadWeeksForCurrentMonth() {
		$http.get(CALENDAR_EVENTS_LIST_URL + '?access_token=' + $scope.accessToken)
		.success(function(calendar) {
			var firstMondayToShow = getFirstMondayToShow()
			var lastSundayToShow = getLastSundayToShow()
			$scope.calendarGrid = spreadCalendarEventsBetween(
				calendar, firstMondayToShow, lastSundayToShow)
		})
		.error(function(error) {
			console.log('Error while getting events: "'+ error + '"')
		})
	}

	function loadAccessTokenFromUrl() {
		var path = $location.path().split('/')[1]
		var attributes = path && path.match(/&/) && path.split('&') || []
		var attrMap = {}
		attributes.forEach(function(element) {
			if (!element.match(/\=/)) {
				return
			}
			var entry = element.split('=')
			attrMap[entry[0]] = entry[1]
		})
		$scope.accessToken = attrMap['access_token']
	}

	function getMidnight(date) {
		var tzOffset = date.getTimezoneOffset();
		date.setHours(0, 0, 0)
		date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
		return date
	}

	function getPreviousMonday(date) {
		var d = new Date(date)
		while (d.getDay() != 1) {
			d.setDate(d.getDate() - 1);
		}
		return d
	}

	function getNextSunday(date) {
		var d = new Date(date)
		while (d.getDay() != 0) {
			d.setDate(d.getDate() + 1);
		}
		return d
	}

	function sameDay(date1, date2) {
		return date1.getYear() == date2.getYear()
			&& date1.getMonth() == date2.getMonth()
			&& date1.getDate() == date2.getDate()
	}

	function getEvents(calendar, date) {
		return calendar.items.filter(function(event) {
			if (sameDay(new Date(event.start.dateTime), date)
				&& event.description
				&& event.description.match(/^[+-]/)) {
				return true
			}
		})
	}

	function toLateness(calendarEvent) {
		var description = calendarEvent.description
		var duration
		if (description.match(/^\+inf/)) {
			duration = Number.MAX_VALUE
		} else {
			var durationLine = description.match(/^([+-][0-9]+)/g)
			if (durationLine) {
				duration = parseInt(durationLine)
			}
		}
		return {
			event: calendarEvent.summary,
			duration: duration
		}
	}

	function spreadCalendarEventsBetween(calendar, firstMondayToShow, lastSundayToShow) {
		var calendarGrid = []
		var w = []
		for (var d = firstMondayToShow;
			d.getTime() <= lastSundayToShow.getTime();
			d.setDate(d.getDate() + 1)) {
			if (w.length == 0) {
				calendarGrid.push(w)
			}
			w.push({
				day: d.getDate() == 1 ? '1 '+MONTH_NAMES[d.getMonth()] : ''+d.getDate(),
				date: d.toISOString(),
				latenesses: getEvents(calendar, d).map(function(event) {
					return toLateness(event)
				})
			})
			if (w.length == 7) {
				w = []
			}
		}
		return calendarGrid
	}

	function getFirstMondayToShow() {
		var firstDayOfCurrentMonth = getMidnight(new Date())
		firstDayOfCurrentMonth.setDate(1)
		var firstMondayToShow = getPreviousMonday(firstDayOfCurrentMonth)
		return firstMondayToShow
	}

	function getLastSundayToShow() {
		var lastDayOfCurrentMonth = getMidnight(new Date())
		lastDayOfCurrentMonth.setMonth(lastDayOfCurrentMonth.getMonth() + 1)
		lastDayOfCurrentMonth.setDate(1)
		lastDayOfCurrentMonth.setDate(lastDayOfCurrentMonth.getDate() - 1)
		var lastSundayToShow = getNextSunday(lastDayOfCurrentMonth)
		return lastSundayToShow
	}
}
