<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="mr-2">
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed'
  ]

  // Size variants
  const sizeClasses = {
    sm: ['px-3', 'py-1.5', 'text-sm', 'rounded-md'],
    md: ['px-4', 'py-2', 'text-base', 'rounded-lg'],
    lg: ['px-6', 'py-3', 'text-lg', 'rounded-xl']
  }

  // Color variants
  const variantClasses = {
    primary: [
      'bg-primary-500',
      'text-white',
      'hover:bg-primary-600',
      'focus:ring-primary-500',
      'shadow-soft'
    ],
    secondary: [
      'bg-secondary-500',
      'text-white',
      'hover:bg-secondary-600',
      'focus:ring-secondary-500',
      'shadow-soft'
    ],
    outline: [
      'bg-transparent',
      'text-primary-600',
      'border-2',
      'border-primary-500',
      'hover:bg-primary-50',
      'focus:ring-primary-500'
    ],
    ghost: [
      'bg-transparent',
      'text-neutral-700',
      'hover:bg-neutral-100',
      'focus:ring-neutral-500'
    ],
    danger: [
      'bg-danger-500',
      'text-white',
      'hover:bg-danger-600',
      'focus:ring-danger-500',
      'shadow-soft'
    ]
  }

  const widthClasses = props.fullWidth ? ['w-full'] : []

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant],
    ...widthClasses
  ].join(' ')
})
</script>
