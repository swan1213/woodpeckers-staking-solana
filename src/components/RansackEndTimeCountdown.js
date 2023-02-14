import moment from "moment";
import Countdown from "react-countdown";

export default function RansackEndTimeCountdown({ endTime, endAction, duration, ...props }) {
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            // return <span>{moment(endTime).fromNow()}</span>
            return (
                <>
                </>
            )
        } else {
            // Render a countdown
            return (
                <div className="ransack-countdown">
                    <div className="ransack-countdown-counter">
                        <div className="dec">
                            <p>Time Left</p>
                        </div>
                        <div className="countdown">
                            <div className="count-item">
                                <p>Days</p>
                                <h5>{days < 10 && "0"}{days}</h5>
                            </div>
                            <div className="count-item">
                                <p>Hours</p>
                                <h5>{hours < 10 && "0"}{hours}</h5>
                            </div>
                            <div className="count-item">
                                <p>Minutes</p>
                                <h5>{minutes < 10 && "0"}{minutes}</h5>
                            </div>
                        </div>
                    </div>
                    <div className="progress-bar">
                        <div className="bar" style={{ width: `${(duration - days) / duration * 100}%` }}></div>
                    </div>
                </div>
            );
        }
    };
    return (
        <Countdown date={endTime} renderer={renderer} onComplete={() => endAction()} />
    )
}
