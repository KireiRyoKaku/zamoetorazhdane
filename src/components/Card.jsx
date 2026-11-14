import React, { useRef, useState } from "react";
import { ButtonLink } from "./Button";

const ANIMATION_DURATION = 1500;
const STAGGER_DELAY = 40;
const TILT_ANGLE = 4;
const CUBIC_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

const Card = ({
  title,
  icon: Icon,
  description,
  boldDescription,
  to = "/",
  cta = "Научи повече",
  // image,
  // imageAlt = "",
  active = false,
  cardRef,
  widthClassName = "w-5/6 lg:w-72",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const tiltRef = useRef(null);
  const isRevealed = active || isHovered;

  const handleMouseMove = (event) => {
    if (!tiltRef.current) return;
    const rect = tiltRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setRotateX(((y - rect.height / 2) / (rect.height / 2)) * -4);
    setRotateY(((x - rect.width / 2) / (rect.width / 2)) * 4);
  };

  const resetTilt = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handBox = (origin, offset, rotation, delay) => ({
    width: "110%",
    left: "50%",
    transform: isRevealed
      ? "translateX(-50%) translateY(0) scale(1) rotate(0deg)"
      : `translateX(-50%) translateY(${offset}px) scale(0) rotate(${rotation}deg)`,
    transformOrigin: origin,
    opacity: isRevealed ? 1 : 0,
    pointerEvents: isRevealed ? "auto" : "none",
    transition: `transform ${ANIMATION_DURATION}ms ${CUBIC_EASING}, opacity ${ANIMATION_DURATION * 0.7}ms ${CUBIC_EASING}, background-color 500ms, color 500ms`,
    transitionDelay: delay,
  });

  return (
    <article
      ref={cardRef}
      tabIndex={0}
      aria-label={`${title}: ${description}`}
      className={`service-card relative h-[400px] ${widthClassName} flex-none snap-start rounded-[32px] focus-visible:outline-none ${isRevealed ? "is-revealed" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      onMouseEnter={() => setIsHovered(true)}
      onFocus={() => setIsHovered(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsHovered(false);
        }
      }}
    >
      <div
        ref={tiltRef}
        className="relative h-full w-full overflow-visible rounded-[32px] bg-white shadow-xl"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
          transition:
            rotateX === 0 && rotateY === 0
              ? `transform ${ANIMATION_DURATION * 0.7}ms ${CUBIC_EASING}`
              : "transform 0.1s ease-out",
        }}
      >
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-evenly overflow-hidden rounded-[32px] p-7 pb-[140px] text-center">
          {Icon ? (
            <Icon
              className="h-10 w-10 shrink-0 text-secondary"
              aria-hidden="true"
            />
          ) : null}
          <h2 className="font-rocaTwoBold text-2xl font-bold leading-tight text-fourth sm:text-3xl">
            {title}
          </h2>
          <div className="mt-4 text-center font-rocaTwoThin text-lg leading-relaxed text-fourth">
            {boldDescription && description.includes(boldDescription) ? (
              <>
                {description.slice(0, description.indexOf(boldDescription))}
                <strong className="font-rocaTwoBold font-bold">
                  {boldDescription}
                </strong>
                {description.slice(
                  description.indexOf(boldDescription) + boldDescription.length,
                )}
              </>
            ) : (
              description
            )}
          </div>
        </div>

        {/* {image && (
          <img
            src={image}
            alt={imageAlt}
            className="pointer-events-none absolute left-1/2 top-[98px] z-10 w-[104px] max-w-none -translate-x-1/2"
          />
        )} */}

        <ButtonLink
          to={to}
          variant="secondary"
          tabIndex={isRevealed ? 0 : -1}
          className="absolute z-20"
          style={{
            bottom: "80px",
            ...handBox(
              "left center",
              70,
              -TILT_ANGLE,
              isRevealed ? "0ms" : `${STAGGER_DELAY}ms`,
            ),
          }}
        >
          Научи повече
        </ButtonLink>

        <ButtonLink
          to={to}
          tabIndex={isRevealed ? 0 : -1}
          className="absolute z-30"
          style={{
            bottom: "16px",
            ...handBox(
              "right center",
              110,
              TILT_ANGLE,
              isRevealed ? `${STAGGER_DELAY}ms` : "0ms",
            ),
          }}
        >
          {cta}
        </ButtonLink>
      </div>
    </article>
  );
};

export default Card;
