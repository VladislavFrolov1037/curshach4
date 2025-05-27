import {useState} from "react";
import {answerQuestion} from "../../services/product";

const AdminAnswer = ({ question, setQuestions }) => {
    const [answer, setAnswer] = useState("");
    const handleAnswer = async () => {
        if (!answer.trim()) return;
        try {
            const res = await answerQuestion(question.id, answer.trim());
            setQuestions((prev) =>
                prev.map((q) => (q.id === question.id ? { ...q, answer: res.answer } : q))
            );
        } catch (error) {
            console.error("Ошибка при отправке ответа:", error);
        }
    };
    return (
        <div className="mt-2">
            <input
                type="text"
                className="form-control"
                placeholder="Введите ответ..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
            />
            <button className="btn btn-success btn-sm mt-1" onClick={handleAnswer}>
                Ответить
            </button>
        </div>
    );
};

export default AdminAnswer;