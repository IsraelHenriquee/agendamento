<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-neutral-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-danger-500 ml-1">*</span>
    </label>

    <!-- Input Container -->
    <div class="relative">
      <!-- Icon Left -->
      <div
        v-if="iconLeft"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <component :is="iconLeft" class="h-5 w-5 text-neutral-400" aria-hidden="true" />
      </div>

      <!-- Input -->
      <input
        :id="inputId"
        :type="actualInputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Password Toggle Button -->
      <button
        v-if="shouldShowPasswordToggle"
        type="button"
        @click="togglePasswordVisibility"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        <svg
          v-if="showPassword"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
          />
        </svg>
        <svg
          v-else
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </button>

      <!-- Icon Right -->
      <div
        v-else-if="iconRight"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <component :is="iconRight" class="h-5 w-5 text-neutral-400" aria-hidden="true" />
      </div>
    </div>

    <!-- Helper Text -->
    <p
      v-if="helperText && !errorMessage"
      class="mt-1 text-sm text-neutral-500"
    >
      {{ helperText }}
    </p>

    <!-- Error Message -->
    <p
      v-if="errorMessage"
      class="mt-1 text-sm text-danger-600"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  helperText?: string
  errorMessage?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  iconLeft?: any
  iconRight?: any
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

// Generate unique ID that works consistently with SSR
const inputId = useId()

// Password visibility state
const showPassword = ref(false)

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Computed input type (for password toggle)
const actualInputType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text'
  }
  return props.type
})

// Check if should show password toggle
const shouldShowPasswordToggle = computed(() => props.type === 'password')

const inputClasses = computed(() => {
  const baseClasses = [
    'block',
    'w-full',
    'border',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-1',
    'disabled:bg-neutral-50',
    'disabled:text-neutral-500',
    'disabled:cursor-not-allowed',
    'placeholder:text-neutral-400'
  ]

  // Size variants
  const sizeClasses = {
    sm: ['px-3', 'py-1.5', 'text-sm'],
    md: ['px-4', 'py-2', 'text-base'],
    lg: ['px-5', 'py-3', 'text-lg']
  }

  // Icon padding adjustments
  const iconClasses = []
  if (props.iconLeft) {
    iconClasses.push('pl-10')
  }
  if (props.iconRight || props.type === 'password') {
    iconClasses.push('pr-10')
  }

  // State-based styling
  const stateClasses = props.errorMessage
    ? [
        'border-danger-300',
        'focus:border-danger-500',
        'focus:ring-danger-500'
      ]
    : [
        'border-neutral-300',
        'focus:border-primary-500',
        'focus:ring-primary-500'
      ]

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...iconClasses,
    ...stateClasses
  ].join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>
