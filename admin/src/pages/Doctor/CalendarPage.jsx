// CalendarPage.jsx
import { useState, useEffect, useContext } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const { dToken, backendUrl } = useContext(DoctorContext);
    const [calendarEvents, setCalendarEvents] = useState([]);

    useEffect(() => {
        const fetchCalendarEvents = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/doctor/calendar-events`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        dToken: dToken
                    },
                    body: JSON.stringify({ docId: dToken })
                });
                const data = await response.json();

                if (data.success) {
                    setCalendarEvents(data.calendarEvents);
                } else {
                    console.error("Error fetching calendar events:", data.message);
                }
            } catch (error) {
                console.error("Error fetching calendar events:", error);
            }
        };

        if (dToken) {
            fetchCalendarEvents();
        }
    }, [dToken, backendUrl]);

    const DateCellWrapper = ({ children, value }) => {
        const hasEvent = calendarEvents.some(event => moment(event.start).isSame(value, 'day'));

        return (
            <div className="relative">
                {children}
                {hasEvent && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '3px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'red'
                        }}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="m-5">
            <div className="bg-white rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">Calendar</h2>
                <div style={{ height: 600 }}>
                    <Calendar
                        localizer={localizer}
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        titleAccessor="title"
                        defaultView="month"
                        style={{ margin: '20px' }}
                        dateCellWrapper={DateCellWrapper}
                    />
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
