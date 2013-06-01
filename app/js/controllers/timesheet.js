function Timesheet($scope) {
	$scope.DAYS = DAYS

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

	$scope.setWeeksForCurrentMonth = function() {
		var firstDayOfCurrentMonth = getMidnight(new Date())
		firstDayOfCurrentMonth.setDate(1)

		var lastDayOfCurrentMonth = getMidnight(new Date())
		lastDayOfCurrentMonth.setMonth(lastDayOfCurrentMonth.getMonth() + 1)
		lastDayOfCurrentMonth.setDate(1)
		lastDayOfCurrentMonth.setDate(lastDayOfCurrentMonth.getDate() - 1)

		var firstMondayToShow = getPreviousMonday(firstDayOfCurrentMonth)
		var lastSundayToShow = getNextSunday(lastDayOfCurrentMonth)

		var weeks = []
		var w = []
		for (var d = firstMondayToShow; 
			d.getTime() <= lastSundayToShow.getTime(); 
			d.setDate(d.getDate() + 1)) {
			if (w.length == 0) {
				weeks.push(w)
			}
			w.push({
				day: d.getDate() == 1 ? '1 '+MONTH_NAMES[d.getMonth()] : ''+d.getDate(),
				date: d.toISOString()
			})
			if (w.length == 7) {
				w = []
			}
		}
		$scope.weeks = weeks
	}
}