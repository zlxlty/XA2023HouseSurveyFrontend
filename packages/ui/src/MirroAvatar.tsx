export function MirroAvatar({ avatarURL }: { avatarURL: string }) {
  return (
    <main className="ui-flex ui-justify-center ui-items-center ui-w-36 ui-h-36 ui-bg-gray-200 ui-rounded-[32px] ui-shadow-avatar">
      <section className="ui-z-0 ui-w-24 ui-h-24 ui-overflow-hidden ui-shadow-neumorphism mirro-avatar-border ui-bg-opacity-50">
        {avatarURL && (
          <img
            draggable="false"
            className="ui-w-full ui-h-full ui-object-cover ui-scale-[.85] ui-rounded-3xl ui-select-none"
            src={avatarURL}
            alt="avatar"
            style={{
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
            }}
          />
        )}
      </section>
    </main>
  )
}
