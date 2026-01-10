'use client';

import { FloralElement } from './FloralElement';
import { Flower1, Flower2, Branch1, Branch2, Leaf1, Leaf2 } from './florals';
import { FLORAL_POSITIONS } from '@/app/lib/constants';

const floralComponents = {
  flower1: Flower1,
  flower2: Flower2,
  branch1: Branch1,
  branch2: Branch2,
  leaf1: Leaf1,
  leaf2: Leaf2,
};

export const FloralBackground = () => {
  return (
    <>
      {FLORAL_POSITIONS.map((position, index) => {
        const FloralComponent = floralComponents[position.variant as keyof typeof floralComponents];
        const { variant, animation, delay, ...positionStyles } = position;

        return (
          <FloralElement
            key={index}
            position={positionStyles}
            animation={animation}
            delay={delay}
          >
            <FloralComponent className="w-full h-full" />
          </FloralElement>
        );
      })}
    </>
  );
};
