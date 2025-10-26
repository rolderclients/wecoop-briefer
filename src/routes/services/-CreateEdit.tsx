import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCancel, IconPlus } from '@tabler/icons-react';
import type { UpdateService } from '@/api';
import { useServices } from './-ServicesProvider';

export const CreateEdit = () => {
  const {
    categories,
    createService,
    updateService,
    opened,
    open,
    close,
    archived,
    form,
    formType,
  } = useServices();

  return (
    <>
      <Button
        leftSection={<IconPlus size={20} />}
        disabled={archived}
        onClick={open}
      >
        Добавить
      </Button>

      <Modal
        opened={opened}
        onClose={() => {
          close();
          form.reset();
        }}
        centered
        title={
          formType === 'edit' ? form.getInitialValues().title : 'Новая услуга'
        }
      >
        <form
          onSubmit={form.onSubmit((values) => {
            if (formType === 'edit') updateService(values as UpdateService);
            else
              createService({ title: values.title, category: values.category });
            close();
            form.reset();
            notifications.show({
              message: `Услуга "${values.title}" ${formType === 'edit' ? 'обновлена' : 'создана'}`,
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
              label="Категория"
              placeholder="Выберите категорию"
              data={categories.map((i) => ({ label: i.title, value: i.id }))}
              searchable
              key={form.key('category')}
              {...form.getInputProps('category')}
            />

            <Group ml="auto" mt="lg">
              <Button
                ml="auto"
                size="xs"
                variant="light"
                leftSection={<IconCancel size={16} />}
                onClick={() => {
                  close();
                  form.reset();
                }}
              >
                Отмена
              </Button>

              <Button
                size="xs"
                leftSection={<IconPlus size={20} />}
                type="submit"
              >
                {formType === 'edit' ? 'Сохранить' : 'Добавить'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};
