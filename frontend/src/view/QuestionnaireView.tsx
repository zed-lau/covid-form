import React, {
  FC,
  ChangeEvent,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  Alert,
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { createResponse, getQuestionnaire } from "../api/questionnaire";
import "./QuestionnaireView.css";
import { Question } from "../types";

const buttonSx = {
  margin: "1em",
  borderRadius: "0.5em",
  "&:hover": {
    backgroundColor: "white",
    color: "primary.main",
  },
};

export const QuestionnaireView: FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [title, setTitle] = useState<string>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const questionnaireId = Number(import.meta.env.VITE_QUESTIONNAIRE_ID);
  const [responses, setResponses] = useState<Record<string, string>>({});

  const fetchQuestions = useCallback(async () => {
    const questionnaire = await getQuestionnaire(questionnaireId);
    setTitle(questionnaire.title);
    setQuestions(questionnaire.questions);
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleTextFieldChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setResponses({ ...responses, [e.target.id]: e.target.value });
    },
    [responses, setResponses]
  );

  const handleRadioGroupSelection = useCallback(
    (e: SelectChangeEvent<string>) => {
      setResponses({ ...responses, [e.target.name]: e.target.value });
    },
    [responses, setResponses]
  );

  const handleSubmit = useCallback(async () => {
    const questionIds = questions.reduce<string[]>((acc, question) => {
      acc.push(String(question.id));
      return acc;
    }, []);

    try {
      setIsSuccess(false);
      const result = await createResponse({
        questionnaireId,
        responses,
      });
      if (result.error) {
        if (typeof result.message === "string") {
          setErrorMessage(result.message);
        } else {
          setErrorMessage(result.message[0]);
        }
      } else {
        setErrorMessage(undefined);
        setIsSuccess(true);
      }
    } catch (err) {
      setErrorMessage("Failed to submit form! Please try again later");
    }
  }, [responses, questions]);

  return (
    <div className="questionnaire-view__container">
      <div className="questionnaire-view__header">
        <h2>{title}</h2>
      </div>
      {!errorMessage && isSuccess && (
        <>
          <Alert severity="success">Form submitted successfully!</Alert>
        </>
      )}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <div className="questionnaire-view__content">
        <form>
          <div className="questionnaire-view__questions">
            {questions?.map((question) => (
              <>
                {question.type === "FreeText" && (
                  <TextField
                    className="questionnaire-text-field"
                    required
                    fullWidth
                    inputProps={{ maxLength: 5 }}
                    id={String(question.id)}
                    label={question.text}
                    onChange={handleTextFieldChange}
                    key={question.id}
                  />
                )}

                {question.type === "OneOption" && question.options && (
                  <>
                    <div className="questionnaire-radio-group">
                      <FormLabel id="questionnaire-row-radio-buttons-group-label">
                        {question.text}
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="questionnaire-row-radio-buttons-group-label"
                        className="questionnaire-radio-buttons-group"
                        row
                        name={String(question.id)}
                        onChange={handleRadioGroupSelection}
                      >
                        {question.options?.map((option) => (
                          <FormControlLabel
                            value={option.value}
                            control={<Radio />}
                            label={option.value}
                          />
                        ))}
                      </RadioGroup>
                    </div>
                  </>
                )}
              </>
            ))}
          </div>
          <div className="questionnaire-view__buttons">
            <Button
              sx={buttonSx}
              className="questionnaire-view__button"
              variant="contained"
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
            <Button
              sx={buttonSx}
              className="questionnaire-view__button"
              variant="contained"
              component={Link}
              to="/responses"
            >
              View Responses
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
