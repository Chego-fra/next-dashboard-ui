import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateExam, deleteExam } from '@/lib/actions';
import InputField from '../InputField';

const schema = z.object({
  examTitle: z.string().min(1, { message: 'Exam title is required' }),
  startTime: z.string().min(1, { message: 'Start time is required' }),
  endTime: z.string().min(1, { message: 'End time is required' }),
  lessonName: z.string().min(1, { message: 'Lesson name is required' }),
  score: z.string().min(1, { message: 'Score is required' }),
});

type Inputs = z.infer<typeof schema>;

type CustomResponse = {
  success: boolean;
  message: any;
};

const ExamForm = ({ type, data, id, onSubmit }: { type: 'create' | 'update' | 'delete'; data?: Inputs; id?: number; onSubmit: (formData: any) => void }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleFormSubmit = async (formData: any) => {
    try {
      let response: Response | CustomResponse | undefined;

      if (type === 'create') {
        response = await fetch('http://localhost:4000/api/addExam', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else if (type === 'update' && id) {
        response = await updateExam({ id, ...formData });
      } else if (type === 'delete' && id) {
        response = await deleteExam(id);
      }

      if (response && 'ok' in response) {
        const result = await response.json();
        if (response.ok || result.success) {
          setAlert({
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} successful!`,
            type: 'success',
          });
        } else {
          setAlert({ message: result.message || 'Something went wrong.', type: 'error' });
        }
      } else if (response && 'success' in response) {
        if (response.success) {
          setAlert({
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} successful!`,
            type: 'success',
          });
        } else {
          setAlert({ message: response.message || 'Something went wrong.', type: 'error' });
        }
      } else {
        setAlert({ message: 'No response received from the server.', type: 'error' });
      }

      onSubmit(formData);  // Pass formData to parent modal handler
    } catch (error: any) {
      setAlert({ message: `Error: ${error.message}`, type: 'error' });
    }
  };

  return (
    <form className="flex flex-col gap-8 p-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <h1 className="text-xl font-semibold">{type === 'create' ? 'Create a New Exam' : type === 'update' ? 'Update Exam' : 'Delete Exam'}</h1>

      {type !== 'delete' && (
        <div className="flex justify-between flex-wrap gap-4">
          <InputField label="Exam Title" name="examTitle" defaultValue={data?.examTitle} register={register} error={errors?.examTitle} />
          <InputField label="Start Time" name="startTime" type="datetime-local" defaultValue={data?.startTime} register={register} error={errors?.startTime} />
          <InputField label="End Time" name="endTime" type="datetime-local" defaultValue={data?.endTime} register={register} error={errors?.endTime} />
        </div>
      )}

      {type !== 'delete' && (
        <InputField label="Lesson Name" name="lessonName" defaultValue={data?.lessonName} register={register} error={errors?.lessonName} />
      )}

      {type === 'update' && (
        <InputField label="Score" name="score" defaultValue={data?.score} register={register} error={errors?.score} />
      )}

      {alert && (
        <div className={`mt-4 p-2 text-center rounded-md ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {alert.message}
        </div>
      )}

      <div className="mt-4 flex justify-end gap-4">
        <button className="w-full md:w-auto bg-blue-400 text-white p-2 rounded-md mt-4" type="submit">
          {type.charAt(0).toUpperCase() + type.slice(1)} Exam
        </button>
      </div>
    </form>
  );
};

export default ExamForm;
