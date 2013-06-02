function Timesheet($scope, $http) {
	$scope.DAYS = DAYS

	$scope.loadWeeksForCurrentMonth = function() {
		$http.get('/js/events_extract.json').success(function(calendar) {
			var firstMondayToShow = getFirstMondayToShow()
			var lastSundayToShow = getLastSundayToShow()
			$scope.calendarGrid = spreadCalendarEventsBetween(
				calendar, firstMondayToShow, lastSundayToShow)
		}).error(function(error) {
			console.log('Error while getting events:', error)
		})
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