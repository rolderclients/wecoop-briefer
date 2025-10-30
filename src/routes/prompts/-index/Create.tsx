import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCancel, IconPlus } from '@tabler/icons-react';
import { usePrompts } from './PromptsProvider';

export const Create = () => {
  const { services, models, archived, createPrompt } = usePrompts();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { title: '', service: '', model: '' },
    validate: {
      title: isNotEmpty(),
      service: isNotEmpty(),
      model: isNotEmpty(),
    },
  });

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button
        leftSection={<IconPlus size={20} />}
        disabled={archived}
        onClick={() => {
          form.reset();
          open();
        }}
      >
        Добавить
      </Button>

      <Modal opened={opened} onClose={close} centered title="Новый промт">
        <form
          onSubmit={form.onSubmit((values) => {
            createPrompt({
              title: values.title,
              service: values.service,
              model: values.model,
            });
            close();
            notifications.show({
              message: `Промт "${values.title}" создан`,
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
                Добавить
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};
