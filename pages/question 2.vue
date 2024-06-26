<template>

    <h1>MC Question</h1>
    <div>{{questions[0].stem}}</div>
    <small>{{questions[0].answer_options[0].content}}</small>
    <small>{{questions[0].answer_options[1].content}}</small>
    <small>{{questions[0].answer_options[2].content}}</small>
    <small>{{questions[0].answer_options[3].content}}</small>
    <MCQ></MCQ>
</template>

<script setup>

definePageMeta({
    middleware: ['auth'],
});

const client = useSupabaseClient();


const { data: questions } = useAsyncData('mc_questions', async () => {
    return await client.from('mc_questions').select('*');
},  {
    transform: result => result.data
});


console.log(questions.value);


let { data: mc_questions, error } = await client
  .from('mc_questions')
  .select('*')


const { data2 } = await client
  .from('mc_questions')
  .insert([
    { stem: 'jbkjbjblojbloiv', answer_options: 'otherValue' },
  ])
  .select()


const artworks = await useFetch('https://api.artic.edu/api/v1/artworks');
console.log(artworks);


console.log(data2);       
          
console.log(mc_questions);


</script>