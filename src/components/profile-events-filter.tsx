"use client";

interface Props {
  value: "upcoming" | "past";
}

export default function ProfileEventsFilter({ value }: Props) {
  return (
    <form className="e4s-profile-events__filter" method="GET">
      <label className="e4s-sr-only" htmlFor="profile-events-filter">Event timing</label>
      <select
        id="profile-events-filter"
        name="events"
        defaultValue={value}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      >
        <option value="upcoming">Upcoming events</option>
        <option value="past">Past events</option>
      </select>
    </form>
  );
}
