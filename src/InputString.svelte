<script>
    export let name;
    export let value;
    export let label;
    export let onInputEnd;
    import {propEq, prop, __} from 'ramda'

    const handleKeyPress = (event) => {
        if(propEq('key', 'Enter', event)) {
            onInputEnd(value)
        }
    }
</script>

<div class="input-string-container">
    <div class="input-string">
        <label for="{name}">{label}</label>
        <div class="input-container">
            <input bind:value="{value}" class="string-input" name="{name}" type="text" on:keypress="{(e) => handleKeyPress(e)}" autofocus >
        </div>
    </div>
</div>

<style>
    .input-string-container {
        margin: 0.3em;
    }
    .input-string {
        display: flex;
        border: solid 1px #ccc;
        background-color: #f4f4f4;
        align-items: center;
        padding: 0.5em;
        margin-bottom: 0.5em;
        border-radius: 2px;
    }
    .input-container {
        flex: 1;
        display: flex;
        align-items: center;
    }
    .string-input {
        flex: 1;
        border: none;
        background-color: white;
        border-radius: 2px;
        margin: 0;
        padding: 0;
    }
    input:focus {
        outline: 0;
    }
    .input-string label {
        vertical-align: center;
        padding-right: 10px;
    }
</style>