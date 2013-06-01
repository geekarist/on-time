describe('Timesheet', function() {
	it('should list the weeks to show for current month', function() {
		// GIVEN
		var clock = sinon.useFakeTimers(new Date(2013, 6, 1))
		
		// WHEN
		var weeks = timesheet.listWeeksForCurrentMonth()
		
		// THEN
		expect(weeks.length).to.be.equal(5)
		expect(weeks[0].monday.date).to.be.equal('2013/05/27')
		expect(weeks[4].sunday.date).to.be.equal('2013/06/30')
	})

	it('should list the appointments for a given day')

	it('should get the time, lateness and label of each appointment')
})

