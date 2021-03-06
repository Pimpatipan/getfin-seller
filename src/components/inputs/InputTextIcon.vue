<template>
  <div>
    <div class="d-flex login-main-box">
      <font-awesome-icon
        v-if="icon"
        :icon="icon"
        class="text-white my-auto mr-2"
      />
      <div :class="['div-input login-input w-100 m-0', className]">
        <div class="display-only" v-if="isDisplay"></div>
        <div :class="['input-custom', { error: isValidate }]">
          <label v-if="textFloat != ''">
            {{ textFloat }}
            <span v-if="isRequired" class="text-danger">*</span>
          </label>
          <input
            :class="['custom-input']"
            :type="type == 'password' ? passwordType : type"
            :placeholder="placeholder"
            :name="name"
            :required="required"
            :value="value"
            :size="size"
            @input="$emit('input', $event.target.value)"
            @change="onDataChange"
            @keyup="$emit('onKeyup', $event)"
            @keypress="$emit('onKeypress', $event)"
            :disabled="disabled"
            :maxLength="maxLength"
          />
          <div v-if="isShowPassword" :class="['button-eye', { 'hastextFloat': textFloat != '' }]">
            <font-awesome-icon
              v-if="passwordType == 'password'"
              @click="handleShowHidePassword"
              :icon="['fas', 'eye-slash']"
              :class="[buttonEyeClass]"
            />
            <font-awesome-icon
              v-else
              @click="handleShowHidePassword"
              :icon="['fas', 'eye']"
              :class="[buttonEyeClass]"
            />
          </div>
        </div>
        <img :src="img" alt="logo-lang" v-if="img" class="logo-lang" />
        <span v-if="detail" class="text-desc">{{ detail }}</span>
      </div>
    </div>
    <div v-if="v && v.$error" class="">
      <span class="text-error" v-if="v.required == false"
        >{{ $t("required") }}.
      </span>
      <span class="text-error" v-else-if="v.minLength == false"
        >{{ $t("enterAtLeast") }} {{ v.$params.minLength.min }}
        {{ $t("chars") }}.
      </span>
      <span class="text-error" v-else-if="v.email == false"
        >{{ $t("emailError") }}.</span
      >
      <span class="text-error" v-else-if="v.integer == false"
        >{{ $t("numOnly") }}.
      </span>
      <span class="text-error" v-else-if="v.maxLength == false"
        >{{ $t("noMoreThan") }} {{ v.$params.maxLength.max }} {{ $t("chars") }}.
      </span>
      <span class="text-error" v-else-if="v.decimal == false"
        >{{ $t("numOnly") }}.
      </span>
      <span class="text-error" v-else-if="v.minValue == false"
        >{{ $t("minValueError") }}.
      </span>
      <span class="text-error d" v-if="v.sameAsPassword == false"
        >{{ $t("passNotMatch") }}.
      </span>
      <span class="text-error" v-else-if="v.password == false">
        {{ $t("textValidatePassword") }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    textFloat: {
      required: true,
      type: String,
    },
    placeholder: {
      required: true,
      type: String,
    },
    type: {
      required: true,
      type: String,
    },
    required: {
      required: false,
      type: Boolean,
    },
    detail: {
      required: false,
      type: String,
    },
    size: {
      required: false,
      type: String,
    },
    name: {
      required: false,
      type: String,
    },
    value: {
      required: false,
      type: String | Number,
    },
    isDisplay: {
      required: false,
      type: Boolean,
    },
    isRequired: {
      required: false,
      type: Boolean,
    },
    isValidate: {
      required: false,
      type: Boolean,
    },
    v: {
      required: false,
      type: Object,
    },
    className: {
      required: false,
      type: String,
    },
    img: {
      required: false,
      type: String,
    },
    disabled: {
      required: false,
      type: Boolean,
    },
    icon: {
      required: false,
      type: String,
    },
    maxLength: {
      required: false,
      type: Number,
    },
    isShowPassword: {
      required: false,
      type: Boolean,
    },
    buttonEyeClass: {
      required: false,
      type: String,
    },
  },
  data() {
    return {
      passwordType: "password",
    };
  },
  methods: {
    onDataChange(event) {
      this.$emit("onDataChange", event.target.value);
    },
    handleShowHidePassword() {
      if (this.passwordType == "password") {
        this.passwordType = "text";
      } else {
        this.passwordType = "password";
      }
    },
  },
};
</script>

<style scoped>
.div-input {
  margin-bottom: 15px;
  position: relative;
  white-space: nowrap;
}
.input-custom {
  padding: 0px;
}
.input-custom > label {
  color: #16274a;
  font-size: 16px;
  margin-bottom: 2px;
  font-weight: bold;
}
.input-custom > input {
  color: #16274a;
  /* background-color: white; */
  border: 1px solid #bcbcbc;
  border-radius: 0px;
  padding: 5px 10px;
}
.input-custom > input[size="lg"] {
  height: 45px;
}
.input-custom > input:focus {
  /* border: 1px solid #16274a; */
  border: 1px solid #ffb300;
}
.input-custom.error > input {
  border-color: red !important;
}
::-webkit-input-placeholder {
  /* Edge */
  color: rgba(22, 39, 74, 0.4);
}
:-ms-input-placeholder {
  /* Internet Explorer */
  color: rgba(22, 39, 74, 0.4);
}
::placeholder {
  color: rgba(22, 39, 74, 0.4);
}
.custom-input {
  display: block;
  border: none;
  width: 100%;
}
.text-desc {
  color: rgba(22, 39, 74, 0.4);
  font-size: 12px;
  font-family: "Kanit-Light";
}
.display-only {
  position: absolute;
  z-index: 5000;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.text-error {
  color: #ff0000;
  font-size: 14px;
}
.d-grid {
  display: grid;
}
.button-eye {
  position: absolute;
  right: 10px;
  top: 0.8rem;
  z-index: 6;
}
.hastextFloat {
  top: 2rem;
}
@media (max-width: 767.98px) {
  /* .div-input {
    margin-top: 0;
  } */
  .input-custom > label {
    font-size: 15px;
  }
}
</style>

