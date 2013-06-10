describe('Timesheet', function() {
	beforeEach(module('onTime'))

	var scope
	var httpBackend
	var timesheet
    var location

	beforeEach(inject(function($rootScope, $controller, $location, $injector) {
		location = $location
        scope = $rootScope.$new()
		httpBackend = $injector.get('$httpBackend');
		timesheet = $controller(Timesheet, {$scope: scope})
	}))

	afterEach(function() {
		httpBackend.verifyNoOutstandingExpectation();
		httpBackend.verifyNoOutstandingRequest();
	});

	it('should load the weeks to show for current month', function() {
		// GIVEN
		var clock = sinon.useFakeTimers(Date.parse('2013/06/01 12:00'))
		httpBackend.expectJSONP(/.*/).respond(201, {items: []});
        var givenAccessToken = "TOKEN"

		// WHEN
        location.path('/access_token=' + givenAccessToken)
        scope.$apply()

		// THEN
        httpBackend.flush()
		expect(scope.calendarGrid.length).toEqual(5)
		scope.calendarGrid.forEach(function(w) {
			expect(w.length).toEqual(7)
		})
		expect(scope.calendarGrid[0][0].day).toEqual('27')
		expect(scope.calendarGrid[0][0].date).toEqual('2013-05-27T00:00:00.000Z')
		expect(scope.calendarGrid[0][5].day).toEqual('1 juin')
		expect(scope.calendarGrid[0][5].date).toEqual('2013-06-01T00:00:00.000Z')
		expect(scope.calendarGrid[4][6].day).toEqual('30')
		expect(scope.calendarGrid[4][6].date).toEqual('2013-06-30T00:00:00.000Z')
	})

    it('should load the latenesses for a given day (with duration)', function() {
        // GIVEN
        var clock = sinon.useFakeTimers(Date.parse('2013/05/01 12:00'))
        httpBackend.expectJSONP(/.*/).respond(201, GIVEN_EVENTS);
        var givenAccessToken = "TOKEN"

        // WHEN
        location.path('/access_token=' + givenAccessToken)
        scope.$apply()

        // THEN
        httpBackend.flush()
        var cell = scope.calendarGrid[4][2]
        expect(cell.latenesses.length).toEqual(8)
        expect(cell.latenesses[2].event).toEqual('Transport')
        expect(cell.latenesses[2].duration).toEqual(2)
        expect(cell.latenesses[2].startTime).toEqual('09:00')
        expect(cell.latenesses[4].event).toEqual('Travail')
        expect(cell.latenesses[4].duration).toEqual(-1)
        expect(cell.latenesses[4].startTime).toEqual('14:00')
        expect(cell.latenesses[6].event).toEqual('Vaisselle & rangement')
        expect(cell.latenesses[6].duration).toEqual(Number.MAX_VALUE)
        expect(cell.latenesses[6].startTime).toEqual('22:45')
    })

    it('should sort the latenesses by event start time', function() {
        // GIVEN
        var clock = sinon.useFakeTimers(Date.parse('2013/06/01 12:00'))
        httpBackend.expectJSONP(/.*/).respond(201, GIVEN_UNSORTED_EVENTS);

        // WHEN
        location.path('/access_token=ANY_TOKEN')
        scope.$apply()
        httpBackend.flush()

        // THEN
        var cell = scope.calendarGrid[4][2]
        expect(cell.day).toEqual('26')
        expect(cell.latenesses.map(function(item) {
            return item.event
        })).toEqual(['firstEvent', 'secondEvent', 'thirdEvent'])
    }) 

    it('should indicate if a cell\'s day is today', function() {
        // GIVEN
        var clock = sinon.useFakeTimers(Date.parse('2013/06/01 12:00'))
        httpBackend.expectJSONP(/.*/).respond(201, GIVEN_UNSORTED_EVENTS);

        // WHEN
        location.path('/access_token=NEW_TOKEN')
        scope.$apply()
        httpBackend.flush()

        // THEN
        var cell = scope.calendarGrid[0][5]
        console.log(cell)
        expect(cell.day).toEqual('1 juin')
        expect(cell.today).toEqual(true)
    })

})

var GIVEN_UNSORTED_EVENTS = {
    "items": [
    {"summary": "thirdEvent", "start": {"dateTime": "2013-06-26T22:24:42+02:00"}, "description": "+40"},
    {"summary": "secondEvent", "start": {"dateTime": "2013-06-26T11:09:56+02:00"}, "description": "+12"},
    {"summary": "firstEvent", "start": {"dateTime": "2013-06-26T10:00:00+02:00"}, "description": "+10"}
    ]
}

var GIVEN_EVENTS = {
    "kind": "calendar#events",
    "summary": "Planning 2",
    "items": [
        {
            "kind": "calendar#event",
            "summary": "Repas",
            "start": {"dateTime": "2013-05-29T21:30:00+02:00", "timeZone": "Europe/Paris"},
            "end": {"dateTime": "2013-05-29T22:45:00+02:00", "timeZone": "Europe/Paris"
            }
        },
        {
            "kind": "calendar#event",
            "htmlLink": "https://www.google.com/calendar/event?eid=cjRndjRodDUzZTlycWdnOWp2dmdmNWk5Y3NfMjAxMzA1MjlUMDYxNTAwWiA2N3NpanQ2NmxzbTJrbnJhY2h2ZGg1b2Q0a0Bn",
            "summary": "Douche",
            "description": "+25 28 pouces",
            "start": {"dateTime": "2013-05-29T08:15:00+02:00"},
            "end": {"dateTime": "2013-05-29T09:00:00+02:00"}
        },
        {
            "kind": "calendar#event",
            "htmlLink": "https://www.google.com/calendar/event?eid=bDdiM242MGtsYTJnZTE4cWR1Y24xam00cjhfMjAxMzA1MjlUMDUwMDAwWiA2N3NpanQ2NmxzbTJrbnJhY2h2ZGg1b2Q0a0Bn",
            "summary": "Petit dej",
            "description": "+33 Couché trop tard",
            "start": {"dateTime": "2013-05-29T07:00:00+02:00"},
            "end": {"dateTime": "2013-05-29T08:15:00+02:00"}
        },
        {
            "kind": "calendar#event",
            "htmlLink": "https://www.google.com/calendar/event?eid=YjNjMTk3N2ZqOXJicHY5cDJzYWRocWFmNjBfMjAxMzA1MjlUMDcwMDAwWiA2N3NpanQ2NmxzbTJrbnJhY2h2ZGg1b2Q0a0Bn",
            "summary": "Transport",
            "description": "+2",
            "start": {"dateTime": "2013-05-29T09:00:00+02:00"},
            "end": {"dateTime": "2013-05-29T09:45:00+02:00"}
        },
        {
            "kind": "calendar#event",
            "htmlLink": "https://www.google.com/calendar/event?eid=NzEzdWduMHMzY3JrNnYzNjBtbmtoN2xydmtfMjAxMzA1MjlUMTIwMDAwWiA2N3NpanQ2NmxzbTJrbnJhY2h2ZGg1b2Q0a0Bn",
            "summary": "Travail",
            "description": "-1 RER A très fluide aujourd'hui",
            "start": {"dateTime": "2013-05-29T14:00:00+02:00"},
            "end": {"dateTime": "2013-05-29T18:00:00+02:00"}
        },
        {
            "kind": "calendar#event",
            "htmlLink": "https://www.google.com/calendar/event?eid=OTEzMTA5bGRmY3B1aXMzdWFiZGo2a3ZucmdfMjAxMzA1MjlUMDc0NTAwWiA2N3NpanQ2NmxzbTJrbnJhY2h2ZGg1b2Q0a0Bn",
            "summary": "Travail",
            "description": "+0",
            "start": {"dateTime": "2013-05-29T09:45:00+02:00", "timeZone": "Europe/Paris"},
            "end": {"dateTime": "2013-05-29T12:00:00+02:00", "timeZone": "Europe/Paris"
            }
        },
        {
            "kind": "calendar#event",
            "htmlLink": "https://www.google.com/calendar/event?eid=dTRiYzQ5c2VldnFrazhsM250OTduNWY4ODBfMjAxMzA1MjlUMTkzMDAwWiA2N3NpanQ2NmxzbTJrbnJhY2h2ZGg1b2Q0a0Bn",
            "summary": "Repas",
            "description": "+50",
            "start": {"dateTime": "2013-05-29T21:30:00+02:00", "timeZone": "Europe/Paris"},
            "end": {"dateTime": "2013-05-29T22:45:00+02:00", "timeZone": "Europe/Paris"
            }
        },
        {
            "kind": "calendar#event",
            "htmlLink": "https://www.google.com/calendar/event?eid=OWlnNXNkbG84N2RpNDduYzU1dW12MWJkNmtfMjAxMzA1MjlUMjA0NTAwWiA2N3NpanQ2NmxzbTJrbnJhY2h2ZGg1b2Q0a0Bn",
            "summary": "Vaisselle & rangement",
            "description": "+inf",
            "start": {"dateTime": "2013-05-29T22:45:00+02:00"},
            "end": {"dateTime": "2013-05-29T23:00:00+02:00"}
        },
        {
            "kind": "calendar#event",
            "htmlLink": "https://www.google.com/calendar/event?eid=M2hvc3NiNXFoODlmaHN2b3Uzc28wdTVyaGdfMjAxMzA1MjlUMjEzMDAwWiA2N3NpanQ2NmxzbTJrbnJhY2h2ZGg1b2Q0a0Bn",
            "summary": "Sommeil",
            "description": "+28",
            "start": {"dateTime": "2013-05-29T23:30:00+02:00"},
            "end": {"dateTime": "2013-05-30T07:00:00+02:00"},
        }
    ]
}
