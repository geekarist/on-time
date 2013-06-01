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
			var weeks = scope.listWeeksForCurrentMonth()
			
			// THEN
			expect(weeks.length).toEqual(5)
			expect(weeks[0].monday.date).toEqual('2013/05/27')
			expect(weeks[4].sunday.date).toEqual('2013/06/30')
		})

	it('should list the appointments for a given day')

	it('should get the time, lateness and label of each appointment')
})

