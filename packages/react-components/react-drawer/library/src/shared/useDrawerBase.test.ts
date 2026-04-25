import { renderHook } from '@testing-library/react-hooks';

import { useDrawerBase_unstable } from './useDrawerBase';
import { useDrawerDefaultProps } from './useDrawerDefaultProps';

describe('useDrawerBase_unstable', () => {
  it('returns only behavior props with defaults', () => {
    const { result } = renderHook(() => useDrawerBase_unstable({}));

    expect(result.current).toEqual({
      open: false,
      position: 'start',
      unmountOnClose: true,
    });
    expect(result.current).not.toHaveProperty('size');
  });

  it('does not include size even when a runtime object contains it', () => {
    const { result } = renderHook(() =>
      useDrawerBase_unstable({ open: true, position: 'end', size: 'large' } as Parameters<
        typeof useDrawerBase_unstable
      >[0]),
    );

    expect(result.current).toEqual({
      open: true,
      position: 'end',
      unmountOnClose: true,
    });
    expect(result.current).not.toHaveProperty('size');
  });
});

describe('useDrawerDefaultProps', () => {
  it('keeps styled drawer size defaults', () => {
    const { result } = renderHook(() => useDrawerDefaultProps({}));

    expect(result.current).toEqual({
      open: false,
      position: 'start',
      size: 'small',
      unmountOnClose: true,
    });
  });

  it('keeps styled drawer custom size', () => {
    const { result } = renderHook(() => useDrawerDefaultProps({ size: 'large' }));

    expect(result.current.size).toBe('large');
  });
});
