import React from 'react';

function Notifications({ toggleNotificationModal }) {
    const notificationStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        backgroundColor: '#121212',
        color: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    };

    const notificationContainerStyle = {
        maxHeight: '200px',
        overflowY: 'auto',
    };

    const notificationItemStyle = {
        marginBottom: '10px',
        padding: '10px',
        backgroundColor: '#1E1E1E',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    };

    return (
        <div style={notificationStyle}>
            <div>
                <div>
                    This is a notification message.
                    <button className='red-btn' onClick={toggleNotificationModal}>Close</button>
                </div>
                <div id="notificationContainer" style={notificationContainerStyle}>
                    <div className="notification" style={notificationItemStyle}>
                        Player 1 wants to join p2 team 1
                        <div>
                            <button className='green-btn' onClick={() => console.log('Accept clicked')}>Accept</button>
                            <button className='red-btn' onClick={() => console.log('Reject clicked')}>Reject</button>
                        </div>
                    </div>
                    <div className="notification" style={notificationItemStyle}>Player 3 left p2 team 1</div>
                    <div className="notification" style={notificationItemStyle}>Your team p2 team 2 is added a match of tournament p1 t1</div>
                    <div className="notification" style={notificationItemStyle}>You are accepted to join p3 team 1</div>
                </div>
            </div>
        </div>
    );
}

export default Notifications;
