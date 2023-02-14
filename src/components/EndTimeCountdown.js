import moment from "moment";
import Countdown from "react-countdown";
import { EPOCH } from "../contexts/type";

export default function EndTimeCountdown({ endTime, endAction, duration, nested, ...props }) {
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            // return <span>{moment(endTime).fromNow()}</span>
            return (
                <>
                    <div className="progress-bar">
                        {/* <div className="bar" style={{ width: `${30}%` }}></div> */}
                    </div>
                    <div className="countdown">
                        <div className="count-item">
                            <p>Days</p>
                            <h5>{"00"}</h5>
                        </div>
                        <div className="count-item">
                            <p>Hours</p>
                            <h5>{"00"}</h5>
                        </div>
                        <div className="count-item">
                            <p>Minutes</p>
                            <h5>{"00"}</h5>
                        </div>
                    </div>
                </>
            )
        } else {
            // Render a countdown
            return (
                <>
                    <div className="progress-bar">
                        <div className="bar" style={{ width: `${(duration - days) / duration * 100}%` }}></div>
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
                </>
            );
        }
    };
    return (
        <Countdown date={endTime} renderer={renderer} onComplete={() => endAction()} />
    )
}
