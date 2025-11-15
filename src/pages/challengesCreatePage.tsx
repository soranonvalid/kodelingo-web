/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import SectionHead from "@/components/ui/sectionHead";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageLayout from "@/layout/pageLayout";
import { withProtected } from "@/utils/auth/use-protected";
import { SiCplusplus, SiJavascript, SiPython } from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { ClipboardX, Ellipsis, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/user";
import { mongo } from "@/utils/mongo/api";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Lang = "javascript" | "python" | "java" | "cpp" | "other";
type Difficulty = "easy" | "intermediate" | "difficult";

type QuestionSchema = {
  text: string;
  options?: string[] | undefined;
  answer: string;
};

type ChallengeSchema = {
  name: string;
  lang: Lang;
  author: string | null;
  difficulty: Difficulty;
  questions: QuestionSchema[];
};

const MIN_QUESTIONS = 3;
const MAX_QUESTIONS = 10;

const makeEmptyQuestion = (): QuestionSchema & { optionsArr: string[] } => {
  return {
    text: "",
    options: undefined,
    answer: "",
    optionsArr: ["", ""],
  } as never;
};

const ChallengesCreate: React.FC = () => {
  const { uid } = useUser();
  const [name, setName] = useState("");
  const [lang, setLang] = useState<Lang | "">("");
  const [difficulty, setDifficulty] = useState<Difficulty | "">("");
  const [questions, setQuestions] = useState(() => [makeEmptyQuestion()]);
  const [formError, setFormError] = useState<string | null>(null);
  const [questionErrors, setQuestionErrors] = useState<(string | null)[]>(() =>
    questions.map(() => null)
  );
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    setQuestionErrors((prev) => {
      const copy = prev.slice(0, questions.length);
      while (copy.length < questions.length) copy.push(null);
      return copy;
    });
  }, [questions.length]);

  const validateQuestion = useCallback((q: (typeof questions)[number]) => {
    if (!q.text || q.text.trim().length === 0)
      return "Question text is required";
    if (!q.text || q.text.trim().length > 100)
      return "Question text is too long (Max. 100)";
    const realOptions = q.optionsArr?.filter((o) => o.trim().length > 0) ?? [];
    if ((q.optionsArr?.[0] ?? "").trim().length === 0)
      return "Top choice is required";

    const len = q.optionsArr ? q.optionsArr.length : 0;
    for (let i = 0; i < len; i++) {
      const val = (q.optionsArr?.[i] ?? "").trim();
      if (val.length > 50) return `choice ${i + 1} is too long (max. 50)`;
      if (i !== 0 && val.length === 0) return `choice ${i + 1} is required`;
    }

    if (realOptions.length < 2)
      return "At least two non-empty options are required";
    return null;
  }, []);

  const handleAddQuestion = () => {
    if (questions.length >= MAX_QUESTIONS) return;
    setQuestions((prev) => [...prev, makeEmptyQuestion()]);
    setQuestionErrors((prev) => [...prev, null]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
    setQuestionErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddOption = (qIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        if ((q.optionsArr?.length ?? 0) >= 4) return q;
        return { ...q, optionsArr: [...(q.optionsArr || []), ""] };
      })
    );
  };

  const handleRemoveOption = (qIndex: number, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        if ((q.optionsArr?.length ?? 0) <= 2) return q;
        const newArr = q.optionsArr.filter((_, oi) => oi !== optionIndex);
        const newAnswer = (newArr[0] ?? "").trim();
        return { ...q, optionsArr: newArr, answer: newAnswer };
      })
    );
    setQuestionErrors((prev) => prev.map((e, i) => (i === qIndex ? null : e)));
  };

  const handleChangeQuestionField = (
    qIndex: number,
    field: "text",
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i !== qIndex ? q : { ...q, [field]: value }))
    );
    setQuestionErrors((prev) => prev.map((e, i) => (i === qIndex ? null : e)));
  };

  const handleChangeOption = (
    qIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i !== qIndex
          ? q
          : {
              ...q,
              optionsArr: q.optionsArr.map((opt, oi) =>
                oi === optionIndex ? value : opt
              ),
              answer: optionIndex === 0 ? value : q.answer,
            }
      )
    );
    setQuestionErrors((prev) => prev.map((e, i) => (i === qIndex ? null : e)));
  };

  const buildFinalQuestions = useCallback((): QuestionSchema[] => {
    return questions.map((q) => {
      const realOptions =
        q.optionsArr?.filter((o) => o.trim().length > 0) ?? [];
      return {
        text: q.text.trim(),
        options: realOptions.length > 0 ? realOptions : undefined,
        answer: (q.optionsArr[0] ?? "").trim(),
      };
    });
  }, [questions]);

  const validateForm = useCallback(() => {
    if (!name || name.trim().length === 0) return "Challenge name is required";
    if (!lang) return "Language is required";
    if (!difficulty) return "Difficulty is required";
    if (!questions || questions.length < MIN_QUESTIONS)
      return `At least ${MIN_QUESTIONS} questions are required`;
    return null;
  }, [name, lang, difficulty, questions]);

  const navigate = useNavigate();
  const handleCreate = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      const formValidationError = validateForm();
      setFormError(formValidationError ?? null);

      const qErrors = questions.map((q) => validateQuestion(q));
      setQuestionErrors(qErrors);

      if (formValidationError) return null;

      const firstQuestionErrorIndex = qErrors.findIndex((qe) => qe !== null);
      if (firstQuestionErrorIndex !== -1) return null;

      const finalQuestions = buildFinalQuestions();
      if (finalQuestions.length < MIN_QUESTIONS) {
        setFormError(`At least ${MIN_QUESTIONS} questions are required`);
        return null;
      }
      if (finalQuestions.length > MAX_QUESTIONS) {
        setFormError(`Maximum ${MAX_QUESTIONS} questions allowed`);
        return null;
      }

      const final: ChallengeSchema = {
        name: name.trim(),
        lang: lang as Lang,
        author: uid,
        difficulty: difficulty as Difficulty,
        questions: finalQuestions,
      };

      console.log("Challenge valid:", final);

      setFormError(null);
      setQuestionErrors((prev) => prev.map(() => null));

      setIsProcess(true);
      try {
        const res = await mongo.post("/challenges", final);
        console.log("challenge created: ", res);
        navigate(`/challenges/${res.data._id}`);
      } catch (err: any) {
        console.error(err);
        setFormError(err);
      } finally {
        setIsProcess(false);
      }
      return final;
    },
    [
      name,
      lang,
      difficulty,
      questions,
      validateQuestion,
      validateForm,
      buildFinalQuestions,
      uid,
      navigate,
    ]
  );

  return (
    <PageLayout scroll={false}>
      <SectionHead title="Create Challenge">
        <form
          ref={formRef}
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          <Input
            type="text"
            placeholder="Challenge Name"
            value={name}
            onChange={(ev: any) => {
              setName(ev.target.value);
              if (formError) setFormError(null);
            }}
          />
          <Select
            onValueChange={(v: string) => {
              const mapped = v === "others" ? "other" : v;
              setLang(mapped as Lang);
              if (formError) setFormError(null);
            }}
            value={lang || undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Languange" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="cpp">
                  <SiCplusplus />
                  C++
                </SelectItem>
                <SelectItem value="javascript">
                  <SiJavascript />
                  Javascript
                </SelectItem>
                <SelectItem value="java">
                  <FaJava />
                  Java
                </SelectItem>
                <SelectItem value="python">
                  <SiPython />
                  Python
                </SelectItem>
                <SelectItem value="others">
                  <Ellipsis />
                  Others
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(v: string) => {
              const normalized = v.toLowerCase();
              setDifficulty(normalized as Difficulty);
              if (formError) setFormError(null);
            }}
            value={difficulty || undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="difficult">Difficult</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-5">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  disabled={isProcess}
                  className={`w-min ${
                    isProcess
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  Create
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You won't be able to edit after this, for the purpose of
                    fair competition between challenges.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    type="button"
                    disabled={isProcess}
                    className={`w-min ${
                      isProcess
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    onClick={() => {
                      if (formRef.current?.requestSubmit) {
                        formRef.current.requestSubmit();
                      } else if (formRef.current) {
                        formRef.current.submit();
                      }
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger
                disabled={isProcess ? true : false}
                className={`flex gap-2 text-red-500 items-center text-sm ${
                  isProcess ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <ClipboardX size={15} />
                Discard
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your challenge will be discarded, any changes won't be
                    saved.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isProcess ? true : false}
                    className="cursor-pointer bg-red-500"
                    onClick={() => {
                      navigate("/challenges");
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {formError ? (
            <p className="text-red-400 italic text-sm">{formError}</p>
          ) : null}
        </form>
      </SectionHead>

      <SectionHead title="Questions">
        <section className="flex flex-col gap-5">
          {questions.map((q, qi) => (
            <div
              key={qi}
              className="rounded-2xl border border-black/10 min-w-full z-10 snap-start px-6 py-5 sm:py-3 sm:px-5 flex flex-col gap-3 bg-[linear-gradient(234.98deg,#FFFFFF_49.95%,#F4F4F4_99.56%)]"
            >
              <div className="flex items-center justify-between gap-2">
                <Input
                  type="text"
                  placeholder={`Question ${qi + 1}`}
                  value={q.text}
                  onChange={(ev: any) =>
                    handleChangeQuestionField(qi, "text", ev.target.value)
                  }
                />
                {questions.length > 1 && (
                  <button
                    type="button"
                    className="p-2 rounded-md border border-black/10 cursor-pointer"
                    onClick={() => handleRemoveQuestion(qi)}
                    disabled={questions.length <= 1}
                    aria-label="remove question"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="rounded-2xl border flex flex-col gap-3 border-black/10 p-2">
                {q.optionsArr.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <Input
                      className="rounded-full border border-black/10 z-10 px-4 py-5 text-sm flex-1"
                      type="text"
                      placeholder={oi === 0 ? "Choice & Answer" : "Choice"}
                      value={opt}
                      onChange={(ev: any) =>
                        handleChangeOption(qi, oi, ev.target.value)
                      }
                    />
                    {q.optionsArr.length > 2 ? (
                      <button
                        type="button"
                        className="p-2 rounded-md border border-black/10 cursor-pointer"
                        onClick={() => handleRemoveOption(qi, oi)}
                        aria-label="remove choice"
                      >
                        <X size={14} />
                      </button>
                    ) : null}
                  </div>
                ))}

                <div className="flex gap-2 items-center">
                  {q.optionsArr.length < 4 ? (
                    <button
                      type="button"
                      className="rounded-full border border-black/10 px-3 py-2 flex gap-3 items-center text-sm justify-center w-full cursor-pointer"
                      onClick={() => handleAddOption(qi)}
                    >
                      <Plus />
                    </button>
                  ) : null}
                </div>
              </div>

              {questionErrors[qi] ? (
                <p className="text-red-400 italic text-sm">
                  {questionErrors[qi]}
                </p>
              ) : null}
            </div>
          ))}
          {questions.length < MAX_QUESTIONS ? (
            <button
              type="button"
              className="rounded-full border border-black/10 min-w-full z-10 snap-start px-6 py-5 sm:py-3 sm:px-5 flex gap-3 cursor-pointer items-center justify-center "
              onClick={handleAddQuestion}
            >
              Add Questions
            </button>
          ) : null}
        </section>
      </SectionHead>
    </PageLayout>
  );
};

const ChallengesCreatePage = withProtected(ChallengesCreate);
export default ChallengesCreatePage;
