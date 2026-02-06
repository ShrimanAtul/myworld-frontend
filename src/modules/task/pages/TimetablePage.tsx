import React, { useState } from 'react';
import { Button, Spinner } from '@shared/components';
import { useTimetables, useCreateTimetable, useUpdateTimetable, useDeleteTimetable } from '@shared/hooks/useTimetables';
import { Timetable, TimetableType, DayOfWeek } from '@shared/types/timetable';

const TimetablePage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState<Timetable | undefined>();

  const { data: timetables = [], isLoading, error } = useTimetables();
  const createTimetable = useCreateTimetable();
  const updateTimetable = useUpdateTimetable();
  const deleteTimetable = useDeleteTimetable();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as TimetableType,
      dayOfWeek: formData.get('dayOfWeek') as DayOfWeek,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
    };

    try {
      if (editingTimetable) {
        await updateTimetable.mutateAsync({ id: editingTimetable.id, data });
      } else {
        await createTimetable.mutateAsync(data);
      }
      setIsFormOpen(false);
      setEditingTimetable(undefined);
    } catch (err) {
      console.error('Failed to save timetable:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this timetable entry?')) {
      try {
        await deleteTimetable.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete timetable:', err);
      }
    }
  };

  const groupedByDay = timetables.reduce((acc, entry) => {
    const day = entry.dayOfWeek;
    if (!acc[day]) acc[day] = [];
    acc[day].push(entry);
    return acc;
  }, {} as Record<DayOfWeek, Timetable[]>);

  const sortedDays = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY,
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Failed to load timetable. Please try again.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">Manage your weekly schedule</p>
        <Button onClick={() => { setEditingTimetable(undefined); setIsFormOpen(true); }}>
          + New Entry
        </Button>
      </div>

      {timetables.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No timetable entries yet</h3>
          <p className="text-gray-600 mb-4">Start by creating your first schedule entry!</p>
          <Button onClick={() => setIsFormOpen(true)}>Create Your First Entry</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDays.map((day) => {
            const entries = groupedByDay[day] || [];
            if (entries.length === 0) return null;

            return (
              <div key={day}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{day}</h3>
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <div key={entry.id} className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600">
                              {entry.startTime} - {entry.endTime}
                            </span>
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {entry.type}
                            </span>
                          </div>
                          <h4 className="text-base font-semibold text-gray-900 mt-1">{entry.title}</h4>
                          {entry.description && (
                            <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => { setEditingTimetable(entry); setIsFormOpen(true); }}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingTimetable ? 'Edit Timetable Entry' : 'New Timetable Entry'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingTimetable?.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingTimetable?.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  required
                  defaultValue={editingTimetable?.type || TimetableType.OTHER}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {Object.values(TimetableType).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
                <select
                  name="dayOfWeek"
                  required
                  defaultValue={editingTimetable?.dayOfWeek || DayOfWeek.MONDAY}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {sortedDays.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    required
                    defaultValue={editingTimetable?.startTime}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    required
                    defaultValue={editingTimetable?.endTime}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1" isLoading={createTimetable.isPending || updateTimetable.isPending}>
                  {editingTimetable ? 'Update' : 'Create'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => { setIsFormOpen(false); setEditingTimetable(undefined); }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetablePage;
