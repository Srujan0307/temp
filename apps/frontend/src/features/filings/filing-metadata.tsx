import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { filingMetadataSchema } from './filing-metadata.schema';

type FilingMetadataForm = z.infer<typeof filingMetadataSchema>;

export const FilingMetadata = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FilingMetadataForm>({
    resolver: zodResolver(filingMetadataSchema),
  });

  const onSubmit = (data: FilingMetadataForm) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-lg font-bold">Metadata</h2>
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" {...register('title')} />
        {errors.title && <p>{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="dueDate">Due Date</label>
        <input id="dueDate" type="date" {...register('dueDate')} />
        {errors.dueDate && <p>{errors.dueDate.message}</p>}
      </div>
      <button type="submit">Save</button>
    </form>
  );
};
