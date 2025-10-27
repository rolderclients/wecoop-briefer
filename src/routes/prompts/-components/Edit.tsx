import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCancel, IconPlus } from '@tabler/icons-react';
import type { FormPrompt } from '@/api';
import { usePrompts } from './PromptsProvider';

export const Edit = ({
  form,
  opened,
  close,
}: {
  form: UseFormReturnType<FormPrompt>;
  opened: boolean;
  close: () => void;
}) => {
  const { services, models, updatePrompt } = usePrompts();

  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      title={form.getInitialValues().title}
    >
      <form
        onSubmit={form.onSubmit((values) => {
          updatePrompt(values);
          close();
          notifications.show({
            message: `Промт "${values.title}" обновлен`,
            color: 'green',
          });
        })}
      >
        <Stack>
          <TextInput
            label="Название"
            placeholder="Введите название"
            key={form.key('title')}
            {...form.getInputProps('title')}
          />

          <Select
            label="Услуга"
            placeholder="Выберите услугу"
            data={services.map((i) => ({ label: i.title, value: i.id }))}
            searchable
            key={form.key('service')}
            {...form.getInputProps('service')}
          />

          <Select
            label="Модель ИИ"
            placeholder="Выберите модель ИИ"
            data={models.map((i) => ({ label: i.title, value: i.id }))}
            searchable
            key={form.key('model')}
            {...form.getInputProps('model')}
          />

          <Group ml="auto" mt="lg">
            <Button
              ml="auto"
              size="xs"
              variant="light"
              leftSection={<IconCancel size={16} />}
              onClick={close}
            >
              Отмена
            </Button>

            <Button
              size="xs"
              leftSection={<IconPlus size={20} />}
              type="submit"
            >
              Сохранить
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
