describe('Timesheet', function() {
	beforeEach(module('onTime'))

	var scope
	var timesheet

	beforeEach(inject(function($rootScope, $controller) {
		scope = $rootScope.$new()
		timesheet = $controller(Timesheet, {$scope: scope})
	}))

	it('should list the weeks to show for current month', function() {
		// GIVEN
		var clock = sinon.useFakeTimers(Date.parse('2013/06/01 12:00'))

		// WHEN
		scope.setWeeksForCurrentMonth()
		
		// THEN
		expect(scope.weeks.length).toEqual(5)
		scope.weeks.forEach(function(w) {
			expect(w.length).toEqual(7)
		})
		expect(scope.weeks[0][0].day).toEqual('27')
		expect(scope.weeks[0][0].date).toEqual('2013-05-27T00:00:00.000Z')
		expect(scope.weeks[0][5].day).toEqual('1 juin')
		expect(scope.weeks[0][5].date).toEqual('2013-06-01T00:00:00.000Z')
		expect(scope.weeks[4][6].day).toEqual('30')
		expect(scope.weeks[4][6].date).toEqual('2013-06-30T00:00:00.000Z')
	})

	it('should list the appointments for a given day')

	it('should get the time, lateness and label of each appointment')
})

