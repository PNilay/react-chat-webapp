import { useEffect, useState } from "react";
import "./CurrentPoll_Card.css";
import "./Polls.css";

import { collection, query, where } from "firebase/firestore";
import { updateDoc, doc, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: "right",
    },
    title: {
      display: false,
      text: "Horizontal Bar Chart",
    },
  },
};

function ClosedPoll_Card({ poll, card_index, result }) {
  const [responce, setResponce] = useState();
  const [listnames, setListNames] = useState([]);
  const [pollData, setPollData] = useState();
  const initialValue = new Array(poll.options.length).fill(0);

  const data2 = {
    listnames,
    datasets: [
      {
        label: false,
        data: initialValue,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  useEffect(() => {
    const pollsRef = collection(db, "polls_responce");
    initialValue[0] = 2;

    const q = query(
      pollsRef,
      where("poll_reference_id", "==", poll.polls_responce_id)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let current = [];
      querySnapshot.forEach((doc) => {
        current.push(doc.data());
      });
      setResponce(current[0]);
      setListNames(poll.options);
    });

    return async () => {
      await unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (poll.poll_type == "ssp") {
      responce?.poll_responce?.map((res, index) => {
        initialValue[res.response]++;
      });
      setPollData(initialValue);
    } else if (poll.poll_type == "msp") {
      const reduce = 1 / poll.options.length;

      responce?.poll_responce?.map((res, index) => {
        res?.response?.map((res2, index2) => {
          initialValue[res2] = initialValue[res2] + (1 - index2 * reduce);
        });
      });

      setPollData(initialValue);
    } else {
      console.log("ERROR!");
    }
  }, [responce]);

  return (
    <div className="currentPoll__card">
      <div className="currentPoll__card__question">{poll.question}</div>

      <div className="closedPoll__barChart">
        <Bar
          options={options}
          data={{
            labels: listnames,
            datasets: [
              {
                label: false,
                data: pollData,
                backgroundColor:
                  card_index % 2 == 0
                    ? "rgba(255, 99, 132, 0.5)"
                    : "rgba(96, 156, 221, 0.5)",
              },
            ],
          }}
        />{" "}
      </div>

      <div className="currentPoll__card__count"><b>Total Voters: </b>{poll.completed_by.length}</div>
    </div>
  );
}

export default ClosedPoll_Card;
